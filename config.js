/**
 * Clean Code - Arquivo de Configuração
 * Centralizando todas as configurações da aplicação
 */

// ====== CONFIGURAÇÕES GLOBAIS ======
window.APP_CONFIG = {
    // Configurações de validação
    VALIDATION: {
        MIN_NAME_LENGTH: 2,
        MAX_NAME_LENGTH: 100,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_REGEX: /^[\d\s\-\(\)\+]+$/,
        URL_REGEX: /^https?:\/\/[^\s]+$/,
        MAX_DESCRIPTION_LENGTH: 500
    },

    // Configurações de PDF
    PDF_CONFIG: {
        FORMAT: 'a4',
        ORIENTATION: 'portrait',
        SCALE: 2,
        IMG_WIDTH: 210,
        PAGE_HEIGHT: 295,
        QUALITY: 0.98
    },

    // Configurações de UI
    UI_CONFIG: {
        DEFAULT_TEMPLATE: 'moderno',
        NOTIFICATION_DURATION: 5000,
        DEBOUNCE_DELAY: 300,
        MAX_EXPERIENCES: 10,
        MAX_EDUCATIONS: 10,
        MAX_LANGUAGES: 20
    },

    // Mensagens do sistema
    MESSAGES: {
        SUCCESS: {
            PDF_GENERATED: 'PDF gerado com sucesso!',
            DATA_SAVED: 'Dados salvos automaticamente!',
            FORM_VALID: 'Formulário válido!'
        },
        WARNING: {
            MIN_EXPERIENCE: 'Deve haver pelo menos uma experiência.',
            MIN_EDUCATION: 'Deve haver pelo menos uma formação.',
            MIN_LANGUAGE: 'Deve haver pelo menos um idioma.',
            FIELD_REQUIRED: 'Este campo é obrigatório.',
            MAX_ITEMS_REACHED: 'Número máximo de itens atingido.'
        },
        ERROR: {
            PDF_GENERATION: 'Erro ao gerar PDF. Tente novamente.',
            INVALID_EMAIL: 'E-mail inválido.',
            INVALID_PHONE: 'Telefone inválido.',
            INVALID_URL: 'URL inválida.',
            FORM_INVALID: 'Por favor, corrija os erros no formulário.',
            APP_INITIALIZATION: 'Erro ao carregar a aplicação. Recarregue a página.'
        }
    }
};

// ====== ENUMS E CONSTANTES ======
window.ENUMS = {
    NIVEL_IDIOMAS: {
        basico: 'Básico',
        intermediario: 'Intermediário',
        avancado: 'Avançado',
        fluente: 'Fluente',
        nativo: 'Nativo'
    },

    STATUS_FORMACAO: {
        concluido: 'Concluído',
        cursando: 'Cursando',
        trancado: 'Trancado'
    },

    TEMPLATES: {
        moderno: 'Moderno',
        classico: 'Clássico',
        criativo: 'Criativo',
        minimalista: 'Minimalista'
    },

    TIPOS_VAGA: {
        tecnologia: 'Tecnologia/TI',
        marketing: 'Marketing/Comunicação',
        vendas: 'Vendas/Comercial',
        financas: 'Finanças/Contabilidade',
        rh: 'Recursos Humanos',
        gerencial: 'Gestão/Liderança',
        criativo: 'Design/Criativo',
        geral: 'Geral'
    }
};

// ====== CONFIGURAÇÕES DE OTIMIZAÇÃO POR TIPO DE VAGA ======
window.OTIMIZACOES_POR_VAGA = {
    tecnologia: {
        prioridades: ['habilidadesTecnicas', 'experiencias', 'portfolio', 'formacoes'],
        destaque: 'tecnologias',
        termos: ['desenvolvimento', 'programação', 'sistemas', 'tecnologia', 'software', 'dados'],
        cor: '#667eea',
        dicas: [
            'Destaque suas tecnologias e linguagens de programação',
            'Inclua projetos no seu portfolio',
            'Mencione metodologias ágeis se aplicável'
        ]
    },
    marketing: {
        prioridades: ['experiencias', 'habilidadesComportamentais', 'portfolio', 'formacoes'],
        destaque: 'resultados',
        termos: ['marketing', 'comunicação', 'campanhas', 'digital', 'vendas', 'branding'],
        cor: '#f093fb',
        dicas: [
            'Quantifique seus resultados em campanhas',
            'Destaque conhecimento em ferramentas digitais',
            'Inclua cases de sucesso'
        ]
    },
    vendas: {
        prioridades: ['experiencias', 'habilidadesComportamentais', 'objetivo', 'formacoes'],
        destaque: 'resultados',
        termos: ['vendas', 'comercial', 'clientes', 'metas', 'negociação', 'relacionamento'],
        cor: '#4facfe',
        dicas: [
            'Inclua números de vendas e metas atingidas',
            'Destaque habilidades de negociação',
            'Mencione experiência com CRM'
        ]
    },
    financas: {
        prioridades: ['experiencias', 'formacoes', 'habilidadesTecnicas', 'objetivo'],
        destaque: 'precisao',
        termos: ['financeiro', 'contábil', 'análise', 'relatórios', 'gestão', 'orçamento'],
        cor: '#43e97b',
        dicas: [
            'Destaque conhecimento em ferramentas financeiras',
            'Inclua certificações relevantes',
            'Mencione experiência com compliance'
        ]
    },
    rh: {
        prioridades: ['experiencias', 'habilidadesComportamentais', 'formacoes', 'objetivo'],
        destaque: 'pessoas',
        termos: ['recursos humanos', 'pessoas', 'recrutamento', 'desenvolvimento', 'gestão'],
        cor: '#fa709a',
        dicas: [
            'Destaque habilidades interpessoais',
            'Inclua experiência com processos de RH',
            'Mencione conhecimento em legislação trabalhista'
        ]
    },
    gerencial: {
        prioridades: ['experiencias', 'habilidadesComportamentais', 'objetivo', 'formacoes'],
        destaque: 'lideranca',
        termos: ['gestão', 'liderança', 'equipe', 'estratégia', 'resultados', 'planejamento'],
        cor: '#764ba2',
        dicas: [
            'Destaque experiência em liderança de equipes',
            'Inclua resultados de gestão',
            'Mencione metodologias de gestão conhecidas'
        ]
    },
    criativo: {
        prioridades: ['portfolio', 'experiencias', 'habilidadesTecnicas', 'formacoes'],
        destaque: 'criatividade',
        termos: ['design', 'criativo', 'visual', 'arte', 'inovação', 'UX/UI'],
        cor: '#ffecd2',
        dicas: [
            'Portfolio é essencial - inclua link',
            'Destaque softwares de design dominados',
            'Inclua awards ou reconhecimentos'
        ]
    },
    geral: {
        prioridades: ['experiencias', 'formacoes', 'habilidadesComportamentais', 'objetivo'],
        destaque: 'versatilidade',
        termos: ['profissional', 'desenvolvimento', 'experiência', 'competência'],
        cor: '#667eea',
        dicas: [
            'Mantenha um formato equilibrado',
            'Destaque versatilidade e adaptabilidade',
            'Inclua conquistas relevantes'
        ]
    }
};

// ====== UTILITÁRIOS GLOBAIS ======
window.UTILS = {
    // Debounce para performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Formatação de data
    formatDate: function(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    },

    // Geração de ID único
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Validação de tamanho de arquivo
    validateFileSize: function(file, maxSizeMB) {
        return file.size <= maxSizeMB * 1024 * 1024;
    }
};
