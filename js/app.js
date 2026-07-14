// ============================================================
// APP PRINCIPAL - Restaurante do Cleiton (HTML/JS Estático)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initDarkMode();
    updateCartBadge();
    initSync();
});

// ===== Sync - Detectar mudanças do admin =====
function initSync() {
    // Guardar hash dos dados ao carregar
    const db = getDB();
    const hashAtual = JSON.stringify(db.produtos).length + '_' + db.produtos.filter(p => p.foto).length;

    // Verificar a cada 2 segundos se houve mudança
    setInterval(function() {
        const dbAtual = getDB();
        const hashNovo = JSON.stringify(dbAtual.produtos).length + '_' + dbAtual.produtos.filter(p => p.foto).length;
        if (hashAtual !== hashNovo) {
            mostrarAvisoSync();
        }
    }, 2000);

    // Escutar evento de storage (muda em outra aba)
    window.addEventListener('storage', function(e) {
        if (e.key === 'restaurante_cleiton') {
            mostrarAvisoSync();
        }
    });
}

function mostrarAvisoSync() {
    // Não mostrar se já estiver visível
    if (document.getElementById('syncAviso')) return;

    const aviso = document.createElement('div');
    aviso.id = 'syncAviso';
    aviso.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:var(--vermelho);color:white;padding:12px 24px;border-radius:50px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;align-items:center;gap:12px;animation:slideIn 0.3s ease;cursor:pointer';
    aviso.innerHTML = '<i class="fas fa-sync-alt"></i><span>Dados atualizados! Clique para atualizar.</span>';
    aviso.onclick = function() { location.reload(); };
    document.body.appendChild(aviso);

    // Auto-atualizar após 5 segundos
    setTimeout(function() { location.reload(); }, 5000);
}

// ===== Navbar =====
function initNavbar() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('show'));
    }
}

// ===== Dark Mode =====
function initDarkMode() {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.nav-dark-toggle i');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    }

    document.querySelectorAll('.nav-dark-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon', !isDark);
                icon.classList.toggle('fa-sun', isDark);
            }
        });
    });
}

// ===== Cart Functions =====
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(id, nome, preco, categoria) {
    const cart = getCart();
    const existing = cart.find(item => item.id == id);
    if (existing) {
        existing.quantidade++;
    } else {
        cart.push({ id, nome, preco: parseFloat(preco), categoria, quantidade: 1 });
    }
    saveCart(cart);
    toast(`${nome} adicionado ao carrinho!`, 'success');
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id != id);
    saveCart(cart);
    if (typeof renderCart === 'function') renderCart();
}

function updateQty(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id == id);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) cart = cart.filter(i => i.id != id);
    }
    saveCart(cart);
    if (typeof renderCart === 'function') renderCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartBadge();
    if (typeof renderCart === 'function') renderCart();
}

function updateCartBadge() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantidade, 0);
    document.querySelectorAll('.badge-count').forEach(badge => {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    });
}

function getCartSubtotal() {
    return getCart().reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
}

// ===== Cupom =====
function aplicarCupom() {
    const input = document.getElementById('cupomCodigo');
    if (!input || !input.value.trim()) return;

    const db = getDB();
    const codigo = input.value.trim().toUpperCase();
    const cupom = db.cupons.find(c => c.codigo === codigo && c.ativo);

    if (!cupom) { toast('Cupom inválido!', 'error'); return; }

    const hoje = new Date().toISOString().split('T')[0];
    if (cupom.validade < hoje) { toast('Cupom expirado!', 'error'); return; }

    const subtotal = getCartSubtotal();
    if (subtotal < cupom.minimo) { toast(`Mínimo para este cupom: ${formatarMoeda(cupom.minimo)}`, 'error'); return; }

    localStorage.setItem('cupom_aplicado', JSON.stringify(cupom));
    toast('Cupom aplicado com sucesso!', 'success');
    if (typeof renderCart === 'function') renderCart();
}

function getCupomDesconto() {
    const cupom = JSON.parse(localStorage.getItem('cupom_aplicado') || 'null');
    if (!cupom) return 0;

    const subtotal = getCartSubtotal();
    if (cupom.tipo === 'percentual') return subtotal * (cupom.valor / 100);
    return cupom.valor;
}

// ===== Taxa de Entrega =====
function getTaxaEntrega(bairro) {
    const db = getDB();
    const taxa = db.taxas_entrega.find(t => t.bairro === bairro);
    return taxa ? taxa.taxa : db.configuracoes.taxa_entrega_padrao;
}

// ===== Pedidos =====
function criarPedido(dados) {
    const db = getDB();
    const cart = getCart();

    if (cart.length === 0) { toast('Carrinho vazio!', 'error'); return null; }

    const subtotal = getCartSubtotal();
    const taxaEntrega = getTaxaEntrega(dados.bairro);
    const desconto = getCupomDesconto();
    const total = subtotal + taxaEntrega - desconto;

    const token = Math.random().toString(36).substring(2, 10).toUpperCase();

    const pedido = {
        id: db.pedidos.length > 0 ? Math.max(...db.pedidos.map(p => p.id)) + 1 : 1,
        cliente: {
            nome: dados.nome,
            telefone: dados.telefone,
            endereco: dados.endereco,
            bairro: dados.bairro,
            cidade: dados.cidade || 'São Bento do Sul',
            cep: dados.cep || '',
            complemento: dados.complemento || ''
        },
        itens: cart.map(item => ({ ...item })),
        observacoes: dados.observacoes || '',
        forma_pagamento: dados.forma_pagamento,
        valor_troco: dados.valor_troco || null,
        subtotal,
        taxa_entrega: taxaEntrega,
        desconto,
        total,
        status: 'recebido',
        token,
        data: new Date().toISOString()
    };

    db.pedidos.push(pedido);
    saveDB(db);
    clearCart();
    localStorage.removeItem('cupom_aplicado');

    return pedido;
}

// ===== Avaliações =====
function enviarAvaliacao(dados) {
    const db = getDB();
    const avaliacao = {
        id: db.avaliacoes.length > 0 ? Math.max(...db.avaliacoes.map(a => a.id)) + 1 : 1,
        nome: dados.nome,
        nota_atendimento: parseInt(dados.nota_atendimento),
        nota_comida: parseInt(dados.nota_comida),
        nota_entrega: parseInt(dados.nota_entrega),
        comentario: dados.comentario || '',
        data: new Date().toISOString().split('T')[0]
    };
    db.avaliacoes.push(avaliacao);
    saveDB(db);
    return true;
}

// ===== Contato =====
function enviarContato(dados) {
    toast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    return true;
}

// ===== Toast Notifications =====
function toast(mensagem, tipo = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const msg = document.createElement('div');
    msg.className = `toast-msg ${tipo}`;
    msg.innerHTML = `<i class="fas fa-${tipo === 'success' ? 'check-circle text-success' : 'exclamation-circle text-danger'}"></i>
                     <span>${mensagem}</span>`;
    container.appendChild(msg);

    setTimeout(() => {
        msg.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

// ===== Helpers =====
function getCatName(id) {
    const db = getDB();
    const cat = db.categorias.find(c => c.id == id);
    return cat ? cat.nome : '';
}

function getStarHTML(nota, max = 5) {
    let html = '';
    for (let i = 1; i <= max; i++) {
        html += `<i class="fas fa-star${i <= nota ? '' : '-o'}"></i>`;
    }
    return html;
}

function getStatusText(s) {
    const m = { 'recebido': 'Recebido', 'em_preparo': 'Em Preparo', 'saiu_para_entrega': 'Saiu p/ Entrega', 'entregue': 'Entregue', 'cancelado': 'Cancelado' };
    return m[s] || s;
}

function getStatusClass(s) {
    const m = { 'recebido': 'badge-info', 'em_preparo': 'badge-warning', 'saiu_para_entrega': 'badge-primary', 'entregue': 'badge-success', 'cancelado': 'badge-danger' };
    return m[s] || 'badge-secondary';
}

function adminLogin(email, senha) {
    const db = getDB();
    if (email === db.admin_user.email && senha === db.admin_user.senha) {
        sessionStorage.setItem('admin_logado', 'true');
        return true;
    }
    return false;
}

function adminLogout() {
    sessionStorage.removeItem('admin_logado');
}

function isAdminLogged() {
    return sessionStorage.getItem('admin_logado') === 'true';
}

// ===== WhatsApp =====
function enviarWhatsApp(pedido) {
    let texto = `🍽 *Pedido - Restaurante do Cleiton*\n\n`;
    texto += `📋 *Pedido #${pedido.id}*\n\n`;
    pedido.itens.forEach(item => {
        texto += `• ${item.quantidade}x ${item.nome} - ${formatarMoeda(item.preco * item.quantidade)}\n`;
    });
    texto += `\n💰 *Total: ${formatarMoeda(pedido.total)}*\n`;
    texto += `💳 Pagamento: ${pedido.forma_pagamento}\n`;
    texto += `📍 ${pedido.cliente.endereco}, ${pedido.cliente.bairro}`;
    if (pedido.observacoes) texto += `\n📝 Obs: ${pedido.observacoes}`;

    const db = getDB();
    window.open(`https://wa.me/${db.configuracoes.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank');
}

function formatarMoeda(v) {
    return 'R$ ' + parseFloat(v).toFixed(2).replace('.', ',');
}
