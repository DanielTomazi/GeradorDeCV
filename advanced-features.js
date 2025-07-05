/**
 * Clean Code - Funcionalidades Avançadas
 * Recursos adicionais para melhorar a experiência do usuário
 */

// ====== LOCAL STORAGE MANAGER ======
class LocalStorageManager {
    static STORAGE_KEY = 'curriculo_data_v1';

    static saveData(data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(this.STORAGE_KEY, serializedData);
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }

    static loadData() {
        try {
            const serializedData = localStorage.getItem(this.STORAGE_KEY);
            return serializedData ? JSON.parse(serializedData) : null;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return null;
        }
    }

    static clearData() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            return false;
        }
    }

    static hasData() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    }
}

// ====== AUTO SAVE FUNCTIONALITY ======
class AutoSaveManager {
    static isEnabled = true;
    static saveInterval = 10000; // 10 segundos
    static intervalId = null;

    static start() {
        if (!this.isEnabled) return;

        this.intervalId = setInterval(() => {
            const data = curriculoState.getData();
            if (this.hasDataToSave(data)) {
                LocalStorageManager.saveData(data);
                console.log('📁 Dados salvos automaticamente');
            }
        }, this.saveInterval);
    }

    static stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    static hasDataToSave(data) {
        return data.nome.trim() || data.email.trim() || 
               data.experiencias.length > 0 || data.formacoes.length > 0;
    }

    static enable() {
        this.isEnabled = true;
        this.start();
    }

    static disable() {
        this.isEnabled = false;
        this.stop();
    }
}

// ====== KEYBOARD SHORTCUTS ======
class KeyboardShortcuts {
    static initialize() {
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    static handleKeydown(event) {
        // Ctrl/Cmd + S = Salvar dados manualmente
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            this.saveData();
        }

        // Ctrl/Cmd + D = Download PDF
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            event.preventDefault();
            PDFGenerator.downloadPDF();
        }

        // Ctrl/Cmd + 1-4 = Trocar template
        if ((event.ctrlKey || event.metaKey) && ['1', '2', '3', '4'].includes(event.key)) {
            event.preventDefault();
            this.changeTemplate(event.key);
        }

        // Escape = Fechar notificações
        if (event.key === 'Escape') {
            this.closeNotifications();
        }
    }

    static saveData() {
        const data = curriculoState.getData();
        if (LocalStorageManager.saveData(data)) {
            NotificationManager.showSuccess('💾 Dados salvos manualmente!');
        } else {
            NotificationManager.showError('❌ Erro ao salvar dados!');
        }
    }

    static changeTemplate(key) {
        const templates = ['moderno', 'classico', 'criativo', 'minimalista'];
        const index = parseInt(key) - 1;
        
        if (templates[index]) {
            const selector = DOMUtils.getElementById('template-selector');
            if (selector) {
                selector.value = templates[index];
                EventHandlers.handleTemplateChange();
                NotificationManager.showSuccess(`🎨 Template alterado: ${TEMPLATES[templates[index]]}`);
            }
        }
    }

    static closeNotifications() {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
}

// ====== FORM VALIDATION ENHANCED ======
class FormValidationEnhanced {
    static validateField(field, value) {
        const validations = {
            nome: () => ValidationUtils.isValidName(value),
            email: () => ValidationUtils.isValidEmail(value),
            telefone: () => !value || ValidationUtils.isValidPhone(value),
            portfolio: () => ValidationUtils.isValidUrl(value),
            linkedin: () => !value || this.isValidLinkedIn(value),
            objetivo: () => ValidationUtils.validateLength(value, VALIDATION.MAX_DESCRIPTION_LENGTH)
        };

        return validations[field] ? validations[field]() : true;
    }

    static isValidLinkedIn(url) {
        if (!url) return true;
        return url.includes('linkedin.com') || !url.includes('http');
    }

    static addValidationToField(fieldId) {
        const field = DOMUtils.getElementById(fieldId);
        if (!field) return;

        field.addEventListener('blur', () => {
            this.validateAndStyleField(field, fieldId);
        });

        field.addEventListener('input', debounce(() => {
            this.validateAndStyleField(field, fieldId);
        }, 500));
    }

    static validateAndStyleField(field, fieldId) {
        const isValid = this.validateField(fieldId, field.value);
        
        field.classList.remove('form-validation-error', 'form-validation-success');
        
        if (field.value.trim()) {
            field.classList.add(isValid ? 'form-validation-success' : 'form-validation-error');
        }

        return isValid;
    }

    static initializeAllValidations() {
        const fieldsToValidate = ['nome', 'email', 'telefone', 'portfolio', 'linkedin', 'objetivo'];
        fieldsToValidate.forEach(fieldId => {
            this.addValidationToField(fieldId);
        });
    }
}

// ====== TIPS AND SUGGESTIONS ======
class TipsManager {
    static showTipsForJobType(tipoVaga) {
        const config = OTIMIZACOES_POR_VAGA[tipoVaga];
        if (!config || !config.dicas) return;

        const tipsHtml = config.dicas.map(dica => 
            `<li><i class="fas fa-lightbulb"></i> ${dica}</li>`
        ).join('');

        const tipsContainer = this.createTipsContainer();
        tipsContainer.innerHTML = `
            <div class="tips-header">
                <h4><i class="fas fa-magic"></i> Dicas para ${TIPOS_VAGA[tipoVaga]}</h4>
                <button onclick="this.parentElement.parentElement.remove()" class="tips-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <ul class="tips-list">${tipsHtml}</ul>
        `;

        document.body.appendChild(tipsContainer);

        // Auto-remover após 15 segundos
        setTimeout(() => {
            if (tipsContainer.parentElement) {
                tipsContainer.remove();
            }
        }, 15000);
    }

    static createTipsContainer() {
        const container = DOMUtils.createElement('div', 'tips-container');
        return container;
    }
}

// ====== ENHANCED PREVIEW ======
class EnhancedPreview {
    static addPreviewControls() {
        const previewHeader = DOMUtils.querySelector('.preview-header');
        if (!previewHeader) return;

        const additionalControls = DOMUtils.createElement('div', 'additional-controls');
        additionalControls.innerHTML = `
            <button type="button" class="btn-secondary" onclick="EnhancedPreview.resetZoom()">
                <i class="fas fa-search-minus"></i> Reset Zoom
            </button>
            <button type="button" class="btn-secondary" onclick="EnhancedPreview.printPreview()">
                <i class="fas fa-print"></i> Imprimir
            </button>
            <button type="button" class="btn-secondary" onclick="EnhancedPreview.sharePreview()">
                <i class="fas fa-share"></i> Compartilhar
            </button>
        `;

        previewHeader.appendChild(additionalControls);
    }

    static resetZoom() {
        const preview = DOMUtils.getElementById('cv-preview');
        if (preview) {
            preview.style.transform = 'scale(1)';
            preview.style.transformOrigin = 'top left';
        }
    }

    static printPreview() {
        const preview = DOMUtils.getElementById('cv-preview');
        if (!preview) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Currículo - ${curriculoState.getData().nome}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; }
                        .cv-template { max-width: none; }
                        @media print { body { padding: 0; } }
                    </style>
                </head>
                <body>${preview.innerHTML}</body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    static sharePreview() {
        if (navigator.share) {
            navigator.share({
                title: 'Meu Currículo',
                text: 'Confira meu currículo criado com o Gerador de Currículo Inteligente!',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copiar URL para clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => NotificationManager.showSuccess('🔗 Link copiado para a área de transferência!'))
                .catch(() => NotificationManager.showError('❌ Erro ao copiar link'));
        }
    }
}

// ====== ANALYTICS MOCK ======
class AnalyticsManager {
    static trackEvent(category, action, label = '') {
        // Mock analytics - em produção, integrar com Google Analytics, etc.
        console.log(`📊 Analytics: ${category} | ${action} | ${label}`);
    }

    static trackTemplateChange(template) {
        this.trackEvent('Template', 'Change', template);
    }

    static trackPDFDownload(template) {
        this.trackEvent('Export', 'PDF_Download', template);
    }

    static trackFormCompletion(completionRate) {
        this.trackEvent('Form', 'Completion_Rate', `${completionRate}%`);
    }
}

// ====== PERFORMANCE MONITOR ======
class PerformanceMonitor {
    static init() {
        this.startTime = performance.now();
        this.measureLoadTime();
    }

    static measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            console.log(`⚡ Tempo de carregamento: ${loadTime.toFixed(2)}ms`);
            
            if (loadTime > 3000) {
                console.warn('⚠️ Tempo de carregamento alto detectado');
            }
        });
    }

    static measureRenderTime(functionName, func) {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        
        console.log(`🎯 ${functionName}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
}

// ====== INICIALIZAÇÃO DAS FUNCIONALIDADES AVANÇADAS ======
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades avançadas
    PerformanceMonitor.init();
    KeyboardShortcuts.initialize();
    FormValidationEnhanced.initializeAllValidations();
    EnhancedPreview.addPreviewControls();
    
    // Carregar dados salvos se existirem
    if (LocalStorageManager.hasData()) {
        const savedData = LocalStorageManager.loadData();
        if (savedData) {
            curriculoState.updateData(savedData);
            
            // Preencher formulário com dados salvos
            Object.keys(savedData).forEach(key => {
                const element = DOMUtils.getElementById(key);
                if (element && typeof savedData[key] === 'string') {
                    element.value = savedData[key];
                }
            });
            
            NotificationManager.showSuccess('📂 Dados carregados automaticamente!');
            PreviewManager.updatePreview();
        }
    }
    
    // Iniciar auto-save
    AutoSaveManager.start();
    
    // Adicionar listener para mudança de tipo de vaga
    const tipoVagaSelect = DOMUtils.getElementById('tipo-vaga');
    if (tipoVagaSelect) {
        tipoVagaSelect.addEventListener('change', (e) => {
            TipsManager.showTipsForJobType(e.target.value);
            AnalyticsManager.trackEvent('JobType', 'Change', e.target.value);
        });
    }
    
    console.log('🚀 Funcionalidades avançadas carregadas com sucesso!');
});
