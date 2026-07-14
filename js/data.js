// ============================================================
// BANCO DE DADOS LOCAL - Restaurante do Cleiton
// Tudo armazenado em localStorage
// ============================================================

const DB_KEY = 'restaurante_cleiton';

const DEFAULT_DATA = {
    configuracoes: {
        nome: 'Restaurante do Cleiton',
        telefone: '(47) 99922-2375',
        whatsapp: '5547999222375',
        endereco: 'R. Francisco Pauli, 499 - Oxford, São Bento do Sul - SC',
        cep: '89285-675',
        avaliacao_media: 4.8,
        total_avaliacoes: 133,
        faixa_preco: 'R$20,00 a R$40,00',
        pix_chave: '(47) 99922-2375',
        taxa_entrega_padrao: 5.00,
        meta_descricao: 'Restaurante do Cleiton - Marmitas, Buffet Livre e Pratos Especiais em São Bento do Sul - SC'
    },

    categorias: [
        { id: 1, nome: 'Marmitas', ordem: 1, ativo: true },
        { id: 2, nome: 'Buffet Livre', ordem: 2, ativo: true },
        { id: 3, nome: 'Pratos Especiais', ordem: 3, ativo: true },
        { id: 4, nome: 'Bebidas', ordem: 4, ativo: true },
        { id: 5, nome: 'Sobremesas', ordem: 5, ativo: true }
    ],

    produtos: [
        // Marmitas
        { id: 1, categoria_id: 1, nome: 'Marmita Simples', descricao: 'Arroz, feijão, carne moída e salada.', ingredientes: 'Arroz, feijão, carne moída, alface, tomate', preco: 15.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 2, categoria_id: 1, nome: 'Marmita Completa', descricao: 'Arroz, feijão, dois tipos de carne, farofa e salada.', ingredientes: 'Arroz, feijão, frango, carne moída, farofa, alface', preco: 22.00, foto: '', destaque: true, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 3, categoria_id: 1, nome: 'Marmita Top', descricao: 'Arroz, feijão, picanha, batata frita e salada.', ingredientes: 'Arroz, feijão, picanha, batata, alface, tomate', preco: 32.00, foto: '', destaque: true, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 4, categoria_id: 1, nome: 'Marmita Vegetariana', descricao: 'Arroz, feijão, legumes grelhados, tofu e salada.', ingredientes: 'Arroz, feijão, abobrinha, cenoura, tofu, alface', preco: 18.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true },

        // Buffet Livre
        { id: 5, categoria_id: 2, nome: 'Buffet Livre - Almoço', descricao: 'Arroz, feijão, saladas, massas, carnes e sobremesas. Coma à vontade!', ingredientes: 'Arroz, feijão, macarrão, salada, frango, carne moída, farofa', preco: 28.00, foto: '', destaque: true, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 6, categoria_id: 2, nome: 'Buffet Meio Período', descricao: 'Metade do buffet completo. Ideal para quem quer menos.', ingredientes: 'Arroz, feijão, 1 carne, salada', preco: 18.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true },

        // Pratos Especiais
        { id: 7, categoria_id: 3, nome: 'Feijoada Completa', descricao: 'Feijoada tradicional com arroz, farofa, couve e laranja.', ingredientes: 'Feijão preto, linguiça, costela, arroz, farofa, couve', preco: 35.00, foto: '', destaque: true, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 8, categoria_id: 3, nome: 'Frango Assado', descricao: 'Peito de frango assado com batatas e legumes.', ingredientes: 'Frango, batata, cenoura, ervilha, temperos', preco: 28.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 9, categoria_id: 3, nome: 'Peixe Grelhado', descricao: 'Filé de peixe grelhado com arroz, legumes e vinagrete.', ingredientes: 'Peixe, arroz, abobrinha, cenoura, tomate', preco: 33.00, foto: '', destaque: false, promocao: true, preco_promocional: 28.00, disponivel: true },
        { id: 10, categoria_id: 3, nome: 'Picanha na Chapa', descricao: 'Picanha grelhada com arroz, batata frita e vinagrete.', ingredientes: 'Picanha, arroz, batata, alface, tomate', preco: 38.00, foto: '', destaque: true, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 11, categoria_id: 3, nome: 'Strogonoff de Frango', descricao: 'Strogonoff cremoso com arroz, batata palha e salada.', ingredientes: 'Frango, creme de leite, ketchup, mostarda, batata palha', preco: 26.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true },

        // Bebidas
        { id: 12, categoria_id: 4, nome: 'Suco Natural', descricao: 'Suco de frutas natural da estação.', ingredientes: 'Fruta fresca, água', preco: 8.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 13, categoria_id: 4, nome: 'Refrigerante Lata', descricao: 'Coca-Cola, Guaraná ou Sprite 350ml.', ingredientes: 'Refrigerante', preco: 6.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 14, categoria_id: 4, nome: 'Água Mineral', descricao: 'Água mineral sem gás 500ml.', ingredientes: 'Água mineral', preco: 4.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 15, categoria_id: 4, nome: 'Café', descricao: 'Café fresco passado na hora.', ingredientes: 'Café torrado', preco: 4.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true },

        // Sobremesas
        { id: 16, categoria_id: 5, nome: 'Pudim de Leite', descricao: 'Pudim caseiro com calda de caramelo.', ingredientes: 'Leite, ovos, açúcar, leite condensado', preco: 10.00, foto: '', destaque: true, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 17, categoria_id: 5, nome: 'Sorvete', descricao: 'Bola de sorvete artesanal (chocolate, morango ou creme).', ingredientes: 'Leite, creme, frutas ou chocolate', preco: 8.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true },
        { id: 18, categoria_id: 5, nome: 'Mousse de Maracujá', descricao: 'Mousse cremosa de maracujá.', ingredientes: 'Leite condensado, creme de leite, maracujá', preco: 9.00, foto: '', destaque: false, promocao: true, preco_promocional: 7.00, disponivel: true },
        { id: 19, categoria_id: 5, nome: 'Brigadeiro', descricao: 'Brigadeiro caseiro (unidade).', ingredientes: 'Leite condensado, cacau, manteiga', preco: 4.00, foto: '', destaque: false, promocao: false, preco_promocional: 0, disponivel: true }
    ],

    horarios: [
        { dia: 0, nome: 'Domingo', abertura: '', fechamento: '', ativo: false },
        { dia: 1, nome: 'Segunda-feira', abertura: '11:00', fechamento: '13:30', ativo: true },
        { dia: 2, nome: 'Terça-feira', abertura: '11:00', fechamento: '13:30', ativo: true },
        { dia: 3, nome: 'Quarta-feira', abertura: '11:00', fechamento: '13:30', ativo: true },
        { dia: 4, nome: 'Quinta-feira', abertura: '11:00', fechamento: '13:30', ativo: true },
        { dia: 5, nome: 'Sexta-feira', abertura: '11:00', fechamento: '13:30', ativo: true },
        { dia: 6, nome: 'Sábado', abertura: '11:00', fechamento: '13:30', ativo: true }
    ],

    taxas_entrega: [
        { bairro: 'Oxford', taxa: 3.00, tempo: '20-30 min' },
        { bairro: 'Centro', taxa: 5.00, tempo: '25-35 min' },
        { bairro: 'São Bento', taxa: 5.00, tempo: '25-35 min' },
        { bairro: 'Ipumirim', taxa: 7.00, tempo: '30-40 min' },
        { bairro: 'Tupy', taxa: 6.00, tempo: '25-35 min' },
        { bairro: 'Gralha Azul', taxa: 8.00, tempo: '35-45 min' },
        { bairro: 'Outro', taxa: 10.00, tempo: '40-50 min' }
    ],

    cupons: [
        { codigo: 'DESCONTO10', tipo: 'percentual', valor: 10, minimo: 20, usos_max: 100, usos_atual: 0, validade: '2026-12-31', ativo: true },
        { codigo: 'FRETEGRATIS', tipo: 'fixo', valor: 5.00, minimo: 25, usos_max: 50, usos_atual: 0, validade: '2026-12-31', ativo: true },
        { codigo: 'CLEITON5', tipo: 'fixo', valor: 5.00, minimo: 30, usos_max: 200, usos_atual: 0, validade: '2026-12-31', ativo: true }
    ],

    formas_pagamento: [
        { id: 'pix', nome: 'Pix', icone: 'fas fa-qrcode' },
        { id: 'dinheiro', nome: 'Dinheiro', icone: 'fas fa-money-bill-wave' },
        { id: 'credito', nome: 'Cartão de Crédito', icone: 'fas fa-credit-card' },
        { id: 'debito', nome: 'Cartão de Débito', icone: 'fas fa-credit-card' }
    ],

    avaliacoes: [
        { id: 1, nome: 'Maria S.', nota_atendimento: 5, nota_comida: 5, nota_entrega: 4, comentario: 'Ótimo cardápio com preço justo. Recomendo demais!', data: '2025-06-10' },
        { id: 2, nome: 'João P.', nota_atendimento: 5, nota_comida: 5, nota_entrega: 5, comentario: 'Comida ótima, buffet livre com bom custo-benefício. Virei cliente fiel!', data: '2025-06-08' },
        { id: 3, nome: 'Ana R.', nota_atendimento: 5, nota_comida: 5, nota_entrega: 5, comentario: 'Ótimo atendimento, sobremesas deliciosas e preço justo.', data: '2025-06-05' },
        { id: 4, nome: 'Carlos M.', nota_atendimento: 4, nota_comida: 5, nota_entrega: 4, comentario: 'A feijoada é sensacional! Melhor da cidade.', data: '2025-05-28' },
        { id: 5, nome: 'Fernanda L.', nota_atendimento: 5, nota_comida: 4, nota_entrega: 5, comentario: 'Entrega rápida e comida saborosa. Muito bom!', data: '2025-05-20' }
    ],

    pedidos: [],
    clientes: [],
    banners: [
        { id: 1, titulo: 'Restaurante do Cleiton', subtitulo: 'Comida caseira com sabor de verdade', ativo: true }
    ],

    admin_user: { email: 'admin@cleiton.com', senha: 'admin123', nome: 'Administrador' }
};

// ============================================================
// Gerenciamento do Banco de Dados
// ============================================================

function getDB() {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    return JSON.parse(data);
}

function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function resetDB() {
    localStorage.removeItem(DB_KEY);
}

function formatarMoeda(valor) {
    return 'R$ ' + parseFloat(valor).toFixed(2).replace('.', ',');
}

function getProximoId(lista) {
    if (!lista || lista.length === 0) return 1;
    return Math.max(...lista.map(item => item.id || 0)) + 1;
}

function getCategoriaNome(id) {
    const db = getDB();
    const cat = db.categorias.find(c => c.id == id);
    return cat ? cat.nome : '';
}

function getStatusPedido(status) {
    const map = {
        'recebido': 'Recebido',
        'em_preparo': 'Em Preparo',
        'saiu_para_entrega': 'Saiu para Entrega',
        'entregue': 'Entregue',
        'cancelado': 'Cancelado'
    };
    return map[status] || status;
}

function getStatusBadge(status) {
    const map = {
        'recebido': 'bg-info',
        'em_preparo': 'bg-warning text-dark',
        'saiu_para_entrega': 'bg-primary',
        'entregue': 'bg-success',
        'cancelado': 'bg-danger'
    };
    return map[status] || 'bg-secondary';
}

function getStarHTML(nota, max = 5) {
    let html = '';
    for (let i = 1; i <= max; i++) {
        html += `<i class="fas fa-star${i <= nota ? '' : '-o'}"></i>`;
    }
    return html;
}

function getMediaAvaliacoes(av) {
    return ((av.nota_atendimento + av.nota_comida + av.nota_entrega) / 3).toFixed(1);
}
