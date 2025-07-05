/**
 * Clean Code - Gerador de Currículo Inteligente
 * Aplicando princípios de código limpo: SRP, DRY, KISS
 */

// ====== ALIASES PARA CONFIGURAÇÕES ======
const { VALIDATION, PDF_CONFIG, UI_CONFIG, MESSAGES } = window.APP_CONFIG;
const { NIVEL_IDIOMAS, STATUS_FORMACAO, TEMPLATES, TIPOS_VAGA } = window.ENUMS;
const OTIMIZACOES_POR_VAGA = window.OTIMIZACOES_POR_VAGA;
const { debounce, formatDate, generateId } = window.UTILS;

// ====== STATE MANAGEMENT ======
class CurriculoState {
    constructor() {
        this.data = this.initializeData();
        this.templateAtual = UI_CONFIG.DEFAULT_TEMPLATE;
        this.isValidated = false;
    }

    initializeData() {
        return {
            nome: '',
            email: '',
            telefone: '',
            linkedin: '',
            endereco: '',
            portfolio: '',
            objetivo: '',
            experiencias: [],
            formacoes: [],
            habilidadesTecnicas: '',
            habilidadesComportamentais: '',
            idiomas: [],
            tipoVaga: 'geral'
        };
    }

    updateData(newData) {
        this.data = { ...this.data, ...newData };
        this.isValidated = this.validateData();
    }

    validateData() {
        return this.validateNome() && this.validateEmail();
    }

    validateNome() {
        return this.data.nome && this.data.nome.length >= VALIDATION.MIN_NAME_LENGTH;
    }

    validateEmail() {
        return this.data.email && VALIDATION.EMAIL_REGEX.test(this.data.email);
    }

    getData() {
        return this.data;
    }

    getTemplate() {
        return this.templateAtual;
    }

    setTemplate(template) {
        this.templateAtual = template;
    }
}

const curriculoState = new CurriculoState();

// ====== UTILITY FUNCTIONS ======
class DOMUtils {
    static getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    }

    static querySelector(selector) {
        return document.querySelector(selector);
    }

    static querySelectorAll(selector) {
        return document.querySelectorAll(selector);
    }

    static createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    static addEventListeners(elements, event, callback) {
        elements.forEach(element => {
            element.addEventListener(event, callback);
        });
    }
}

class ValidationUtils {
    static isValidEmail(email) {
        return VALIDATION.EMAIL_REGEX.test(email);
    }

    static isValidPhone(phone) {
        return VALIDATION.PHONE_REGEX.test(phone);
    }

    static isValidName(name) {
        return name && name.trim().length >= VALIDATION.MIN_NAME_LENGTH;
    }

    static isValidUrl(url) {
        return !url || VALIDATION.URL_REGEX.test(url);
    }

    static sanitizeInput(input) {
        return input.trim().replace(/[<>]/g, '');
    }

    static validateLength(text, maxLength) {
        return text.length <= maxLength;
    }
}

class StringUtils {
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    static formatArrayToTags(str, separator = ',') {
        return str.split(separator)
                  .map(item => item.trim())
                  .filter(item => item.length > 0);
    }

    static createSlug(str) {
        return str.toLowerCase()
                  .replace(/\s+/g, '_')
                  .replace(/[^a-z0-9_]/g, '');
    }

    static truncate(str, maxLength) {
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    }
}

// ====== EVENT HANDLERS ======
class EventHandlers {
    static handleFormInput() {
        FormManager.collectFormData();
        PreviewManager.updatePreview();
    }

    static handleFormChange() {
        FormManager.collectFormData();
        PreviewManager.updatePreview();
    }

    static handleTemplateChange() {
        const template = DOMUtils.getElementById('template-selector').value;
        curriculoState.setTemplate(template);
        PreviewManager.updatePreview();
    }

    static handleDownloadPDF() {
        PDFGenerator.downloadPDF();
    }
}

// ====== FORM MANAGEMENT ======
class FormManager {
    static initialize() {
        this.setupInitialForm();
        this.attachEventListeners();
    }

    static setupInitialForm() {
        // Não adicionar itens iniciais automaticamente - deixar o usuário decidir
        this.validateForm();
    }

    static attachEventListeners() {
        const form = DOMUtils.getElementById('cv-form');
        if (form) {
            form.addEventListener('input', EventHandlers.handleFormInput);
            form.addEventListener('change', EventHandlers.handleFormChange);
        }
    }

    static collectFormData() {
        const data = {
            nome: this.getInputValue('nome'),
            email: this.getInputValue('email'),
            telefone: this.getInputValue('telefone'),
            linkedin: this.getInputValue('linkedin'),
            endereco: this.getInputValue('endereco'),
            portfolio: this.getInputValue('portfolio'),
            objetivo: this.getInputValue('objetivo'),
            tipoVaga: this.getInputValue('tipo-vaga'),
            habilidadesTecnicas: this.getInputValue('habilidades-tecnicas'),
            habilidadesComportamentais: this.getInputValue('habilidades-comportamentais'),
            experiencias: this.collectExperiencias(),
            formacoes: this.collectFormacoes(),
            idiomas: this.collectIdiomas()
        };

        curriculoState.updateData(data);
    }

    static getInputValue(id) {
        const element = DOMUtils.getElementById(id);
        return element ? ValidationUtils.sanitizeInput(element.value) : '';
    }

    static collectExperiencias() {
        const experiencias = [];
        const items = DOMUtils.querySelectorAll('.experiencia-item');
        
        items.forEach(item => {
            const cargo = item.querySelector('.exp-cargo')?.value || '';
            const empresa = item.querySelector('.exp-empresa')?.value || '';
            
            if (cargo.trim() || empresa.trim()) {
                experiencias.push({
                    cargo: ValidationUtils.sanitizeInput(cargo),
                    empresa: ValidationUtils.sanitizeInput(empresa),
                    periodo: ValidationUtils.sanitizeInput(item.querySelector('.exp-periodo')?.value || ''),
                    local: ValidationUtils.sanitizeInput(item.querySelector('.exp-local')?.value || ''),
                    descricao: ValidationUtils.sanitizeInput(item.querySelector('.exp-descricao')?.value || '')
                });
            }
        });
        
        return experiencias;
    }

    static collectFormacoes() {
        const formacoes = [];
        const items = DOMUtils.querySelectorAll('.formacao-item');
        
        items.forEach(item => {
            const curso = item.querySelector('.form-curso')?.value || '';
            const instituicao = item.querySelector('.form-instituicao')?.value || '';
            
            if (curso.trim() || instituicao.trim()) {
                formacoes.push({
                    curso: ValidationUtils.sanitizeInput(curso),
                    instituicao: ValidationUtils.sanitizeInput(instituicao),
                    periodo: ValidationUtils.sanitizeInput(item.querySelector('.form-periodo')?.value || ''),
                    status: item.querySelector('.form-status')?.value || 'concluido'
                });
            }
        });
        
        return formacoes;
    }

    static collectIdiomas() {
        const idiomas = [];
        const items = DOMUtils.querySelectorAll('.idioma-item');
        
        items.forEach(item => {
            const nome = item.querySelector('.idioma-nome')?.value || '';
            
            if (nome.trim()) {
                idiomas.push({
                    nome: ValidationUtils.sanitizeInput(nome),
                    nivel: item.querySelector('.idioma-nivel')?.value || 'basico'
                });
            }
        });
        
        return idiomas;
    }

    static validateForm() {
        const data = curriculoState.getData();
        const isValid = ValidationUtils.isValidName(data.nome) && 
                       ValidationUtils.isValidEmail(data.email);
        
        this.updateFormValidationUI(isValid);
        return isValid;
    }

    static updateFormValidationUI(isValid) {
        const downloadBtn = DOMUtils.querySelector('.btn-primary');
        if (downloadBtn) {
            downloadBtn.disabled = !isValid;
            downloadBtn.style.opacity = isValid ? '1' : '0.6';
        }
    }
}

// ====== DYNAMIC FORM COMPONENTS ======
class DynamicFormComponents {
    static addExperiencia() {
        const container = DOMUtils.getElementById('experiencias-container');
        const itemElement = this.createExperienciaElement();
        container.appendChild(itemElement);
        this.attachExperienciaListeners(itemElement);
    }

    static createExperienciaElement() {
        const div = DOMUtils.createElement('div', 'experiencia-item');
        div.innerHTML = `
            <div class="input-row">
                <input type="text" placeholder="Cargo" class="exp-cargo">
                <input type="text" placeholder="Empresa" class="exp-empresa">
            </div>
            <div class="input-row">
                <input type="text" placeholder="Período (ex: Jan 2020 - Atual)" class="exp-periodo">
                <input type="text" placeholder="Local" class="exp-local">
            </div>
            <textarea placeholder="Principais atividades e conquistas" class="exp-descricao" rows="3"></textarea>
            <button type="button" class="btn-remove" onclick="DynamicFormComponents.removeExperiencia(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        return div;
    }

    static attachExperienciaListeners(element) {
        const inputs = element.querySelectorAll('input, textarea');
        DOMUtils.addEventListeners(inputs, 'input', EventHandlers.handleFormInput);
    }

    static removeExperiencia(button) {
        const container = DOMUtils.getElementById('experiencias-container');
        const currentCount = container.children.length;
        
        if (currentCount > 1) {
            button.parentElement.remove();
            EventHandlers.handleFormInput();
        } else {
            NotificationManager.showWarning(MESSAGES.WARNING.MIN_EXPERIENCE);
        }
    }

    static addFormacao() {
        const container = DOMUtils.getElementById('formacoes-container');
        const itemElement = this.createFormacaoElement();
        container.appendChild(itemElement);
        this.attachFormacaoListeners(itemElement);
    }

    static createFormacaoElement() {
        const div = DOMUtils.createElement('div', 'formacao-item');
        div.innerHTML = `
            <div class="input-row">
                <input type="text" placeholder="Curso" class="form-curso">
                <input type="text" placeholder="Instituição" class="form-instituicao">
            </div>
            <div class="input-row">
                <input type="text" placeholder="Período" class="form-periodo">
                <select class="form-status">
                    <option value="concluido">Concluído</option>
                    <option value="cursando">Cursando</option>
                    <option value="trancado">Trancado</option>
                </select>
            </div>
            <button type="button" class="btn-remove" onclick="DynamicFormComponents.removeFormacao(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        return div;
    }

    static attachFormacaoListeners(element) {
        const inputs = element.querySelectorAll('input, select');
        DOMUtils.addEventListeners(inputs, 'input', EventHandlers.handleFormInput);
        DOMUtils.addEventListeners(inputs, 'change', EventHandlers.handleFormChange);
    }

    static removeFormacao(button) {
        const container = DOMUtils.getElementById('formacoes-container');
        const currentCount = container.children.length;
        
        if (currentCount > 1) {
            button.parentElement.remove();
            EventHandlers.handleFormInput();
        } else {
            NotificationManager.showWarning(MESSAGES.WARNING.MIN_EDUCATION);
        }
    }

    static addIdioma() {
        const container = DOMUtils.getElementById('idiomas-container');
        const itemElement = this.createIdiomaElement();
        container.appendChild(itemElement);
        this.attachIdiomaListeners(itemElement);
    }

    static createIdiomaElement() {
        const div = DOMUtils.createElement('div', 'idioma-item');
        div.innerHTML = `
            <div class="input-row">
                <input type="text" placeholder="Idioma" class="idioma-nome">
                <select class="idioma-nivel">
                    <option value="basico">Básico</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                    <option value="fluente">Fluente</option>
                    <option value="nativo">Nativo</option>
                </select>
            </div>
            <button type="button" class="btn-remove" onclick="DynamicFormComponents.removeIdioma(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        return div;
    }

    static attachIdiomaListeners(element) {
        const inputs = element.querySelectorAll('input, select');
        DOMUtils.addEventListeners(inputs, 'input', EventHandlers.handleFormInput);
        DOMUtils.addEventListeners(inputs, 'change', EventHandlers.handleFormChange);
    }

    static removeIdioma(button) {
        const container = DOMUtils.getElementById('idiomas-container');
        const currentCount = container.children.length;
        
        if (currentCount > 1) {
            button.parentElement.remove();
            EventHandlers.handleFormInput();
        } else {
            NotificationManager.showWarning(MESSAGES.WARNING.MIN_LANGUAGE);
        }
    }
}

// ====== NOTIFICATION MANAGER ======
class NotificationManager {
    static showSuccess(message) {
        this.showNotification(message, 'success');
    }

    static showWarning(message) {
        this.showNotification(message, 'warning');
    }

    static showError(message) {
        this.showNotification(message, 'error');
    }

    static showNotification(message, type) {
        // Criar elemento de notificação
        const notification = DOMUtils.createElement('div', `notification notification-${type}`);
        notification.innerHTML = `
            <i class="fas fa-${this.getIconForType(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Adicionar ao body
        document.body.appendChild(notification);

        // Remover automaticamente após o tempo configurado
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, UI_CONFIG.NOTIFICATION_DURATION);
    }

    static getIconForType(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// ====== PREVIEW MANAGEMENT ======
class PreviewManager {
    static updatePreview() {
        const preview = DOMUtils.getElementById('cv-preview');
        const data = curriculoState.getData();
        
        if (!this.hasMinimalData(data)) {
            this.showEmptyState(preview);
            return;
        }
        
        const html = this.generateTemplateHTML();
        preview.innerHTML = html;
        
        // Atualizar validação do formulário
        FormManager.validateForm();
    }

    static hasMinimalData(data) {
        return data.nome.trim() || data.email.trim();
    }

    static showEmptyState(preview) {
        preview.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>Seu currículo aparecerá aqui</h3>
                <p>Preencha seus dados no formulário para visualizar</p>
            </div>
        `;
    }

    static generateTemplateHTML() {
        const template = curriculoState.getTemplate();
        const generators = {
            moderno: () => TemplateGenerators.generateModerno(),
            classico: () => TemplateGenerators.generateClassico(),
            criativo: () => TemplateGenerators.generateCriativo(),
            minimalista: () => TemplateGenerators.generateMinimalista()
        };
        
        return generators[template] ? generators[template]() : generators.moderno();
    }
}

// ====== TEMPLATE GENERATORS ======
class TemplateGenerators {
    static generateModerno() {
        const data = curriculoState.getData();
        const otimizacao = OTIMIZACOES_POR_VAGA[data.tipoVaga];
        
        return `
            <div class="cv-template template-moderno">
                ${this.generateHeaderModerno(data)}
                ${SectionGenerators.generateSectionsByPriority(otimizacao.prioridades)}
            </div>
        `;
    }

    static generateClassico() {
        const data = curriculoState.getData();
        const otimizacao = OTIMIZACOES_POR_VAGA[data.tipoVaga];
        
        return `
            <div class="cv-template template-classico">
                ${this.generateHeaderClassico(data)}
                ${SectionGenerators.generateSectionsByPriority(otimizacao.prioridades)}
            </div>
        `;
    }

    static generateCriativo() {
        const data = curriculoState.getData();
        const otimizacao = OTIMIZACOES_POR_VAGA[data.tipoVaga];
        
        return `
            <div class="cv-template template-criativo">
                ${this.generateHeaderCriativo(data)}
                ${SectionGenerators.generateSectionsByPriority(otimizacao.prioridades)}
            </div>
        `;
    }

    static generateMinimalista() {
        const data = curriculoState.getData();
        const otimizacao = OTIMIZACOES_POR_VAGA[data.tipoVaga];
        
        return `
            <div class="cv-template template-minimalista">
                ${this.generateHeaderMinimalista(data)}
                ${SectionGenerators.generateSectionsByPriority(otimizacao.prioridades)}
            </div>
        `;
    }

    static generateHeaderModerno(data) {
        return `
            <div class="cv-header">
                <h1 class="cv-nome">${data.nome || 'Seu Nome'}</h1>
                ${data.objetivo ? `<p class="cv-objetivo">${data.objetivo}</p>` : ''}
                <div class="cv-contato">
                    ${this.generateContactInfo(data)}
                </div>
            </div>
        `;
    }

    static generateHeaderClassico(data) {
        return `
            <div class="cv-header">
                <h1 class="cv-nome">${data.nome || 'Seu Nome'}</h1>
                <div class="cv-contato">
                    ${data.email || ''} 
                    ${data.telefone ? ` | ${data.telefone}` : ''}
                    ${data.endereco ? ` | ${data.endereco}` : ''}
                </div>
                ${data.linkedin ? `<p><strong>LinkedIn:</strong> ${data.linkedin}</p>` : ''}
                ${data.portfolio ? `<p><strong>Portfolio:</strong> ${data.portfolio}</p>` : ''}
            </div>
        `;
    }

    static generateHeaderCriativo(data) {
        return `
            <div class="cv-header">
                <h1 class="cv-nome">${data.nome || 'Seu Nome'}</h1>
                ${data.objetivo ? `<p class="cv-objetivo">${data.objetivo}</p>` : ''}
                <div class="cv-contato">
                    ${this.generateContactInfo(data, false)}
                </div>
            </div>
        `;
    }

    static generateHeaderMinimalista(data) {
        return `
            <div class="cv-header">
                <h1 class="cv-nome">${data.nome || 'Seu Nome'}</h1>
                <p class="cv-contato">
                    ${data.email || ''} 
                    ${data.telefone ? ` • ${data.telefone}` : ''}
                    ${data.endereco ? ` • ${data.endereco}` : ''}
                </p>
                ${data.objetivo ? `<p class="cv-objetivo">${data.objetivo}</p>` : ''}
            </div>
        `;
    }

    static generateContactInfo(data, withIcons = true) {
        const contacts = [];
        
        if (data.email) {
            contacts.push(withIcons ? 
                `<span><i class="fas fa-envelope"></i> ${data.email}</span>` : 
                `<span>${data.email}</span>`);
        }
        
        if (data.telefone) {
            contacts.push(withIcons ? 
                `<span><i class="fas fa-phone"></i> ${data.telefone}</span>` : 
                `<span>${data.telefone}</span>`);
        }
        
        if (data.endereco) {
            contacts.push(withIcons ? 
                `<span><i class="fas fa-map-marker-alt"></i> ${data.endereco}</span>` : 
                `<span>${data.endereco}</span>`);
        }
        
        if (data.linkedin) {
            contacts.push(withIcons ? 
                `<span><i class="fab fa-linkedin"></i> ${data.linkedin}</span>` : 
                `<span>${data.linkedin}</span>`);
        }
        
        if (data.portfolio) {
            contacts.push(withIcons ? 
                `<span><i class="fas fa-globe"></i> ${data.portfolio}</span>` : 
                `<span>${data.portfolio}</span>`);
        }
        
        return contacts.join('');
    }
}

// ====== SECTION GENERATORS ======
class SectionGenerators {
    static generateSectionsByPriority(prioridades) {
        let html = '';
        
        prioridades.forEach(secao => {
            switch (secao) {
                case 'experiencias':
                    html += this.generateExperienciasSection();
                    break;
                case 'formacoes':
                    html += this.generateFormacoesSection();
                    break;
                case 'habilidadesTecnicas':
                    html += this.generateHabilidadesTecnicasSection();
                    break;
                case 'habilidadesComportamentais':
                    html += this.generateHabilidadesComportamentaisSection();
                    break;
                case 'portfolio':
                    html += this.generatePortfolioSection();
                    break;
                case 'objetivo':
                    html += this.generateObjetivoSection();
                    break;
            }
        });
        
        // Sempre adicionar idiomas no final se houver
        const data = curriculoState.getData();
        if (data.idiomas.length > 0) {
            html += this.generateIdiomasSection();
        }
        
        return html;
    }

    static generateExperienciasSection() {
        const data = curriculoState.getData();
        if (data.experiencias.length === 0) return '';
        
        let html = '<div class="cv-secao"><h3>Experiência Profissional</h3>';
        
        data.experiencias.forEach(exp => {
            html += `
                <div class="cv-experiencia-item">
                    <div class="cv-cargo">${exp.cargo}</div>
                    <div class="cv-empresa">${exp.empresa}</div>
                    ${exp.periodo ? `<div class="cv-periodo">${exp.periodo}</div>` : ''}
                    ${exp.local ? `<div class="cv-local">${exp.local}</div>` : ''}
                    ${exp.descricao ? `<div class="cv-descricao">${exp.descricao}</div>` : ''}
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    static generateFormacoesSection() {
        const data = curriculoState.getData();
        if (data.formacoes.length === 0) return '';
        
        let html = '<div class="cv-secao"><h3>Formação</h3>';
        
        data.formacoes.forEach(form => {
            html += `
                <div class="cv-formacao-item">
                    <div class="cv-curso">${form.curso}</div>
                    <div class="cv-instituicao">${form.instituicao}</div>
                    ${form.periodo ? `<div class="cv-periodo">${form.periodo}</div>` : ''}
                    <div class="cv-status">${STATUS_FORMACAO[form.status] || form.status}</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    static generateHabilidadesTecnicasSection() {
        const data = curriculoState.getData();
        if (!data.habilidadesTecnicas) return '';
        
        const habilidades = StringUtils.formatArrayToTags(data.habilidadesTecnicas);
        
        let html = '<div class="cv-secao"><h3>Habilidades Técnicas</h3>';
        html += '<div class="cv-habilidades">';
        
        habilidades.forEach(habilidade => {
            html += `<span class="cv-habilidade">${habilidade}</span>`;
        });
        
        html += '</div></div>';
        return html;
    }

    static generateHabilidadesComportamentaisSection() {
        const data = curriculoState.getData();
        if (!data.habilidadesComportamentais) return '';
        
        const habilidades = StringUtils.formatArrayToTags(data.habilidadesComportamentais);
        
        let html = '<div class="cv-secao"><h3>Habilidades Comportamentais</h3>';
        html += '<div class="cv-habilidades">';
        
        habilidades.forEach(habilidade => {
            html += `<span class="cv-habilidade">${habilidade}</span>`;
        });
        
        html += '</div></div>';
        return html;
    }

    static generatePortfolioSection() {
        const data = curriculoState.getData();
        if (!data.portfolio) return '';
        
        return `
            <div class="cv-secao">
                <h3>Portfolio</h3>
                <p><a href="${data.portfolio}" target="_blank">${data.portfolio}</a></p>
            </div>
        `;
    }

    static generateObjetivoSection() {
        const data = curriculoState.getData();
        if (!data.objetivo) return '';
        
        return `
            <div class="cv-secao">
                <h3>Objetivo</h3>
                <p>${data.objetivo}</p>
            </div>
        `;
    }

    static generateIdiomasSection() {
        const data = curriculoState.getData();
        if (data.idiomas.length === 0) return '';
        
        let html = '<div class="cv-secao"><h3>Idiomas</h3>';
        
        data.idiomas.forEach(idioma => {
            html += `<p><strong>${idioma.nome}:</strong> ${NIVEL_IDIOMAS[idioma.nivel] || idioma.nivel}</p>`;
        });
        
        html += '</div>';
        return html;
    }
}

// ====== PDF GENERATOR ======
class PDFGenerator {
    static async downloadPDF() {
        const data = curriculoState.getData();
        
        if (!ValidationUtils.isValidName(data.nome)) {
            NotificationManager.showError(MESSAGES.ERROR.FORM_INVALID);
            return;
        }

        try {
            NotificationManager.showSuccess('Gerando PDF... Por favor, aguarde.');
            
            const element = DOMUtils.getElementById('cv-preview');
            const canvas = await this.generateCanvas(element);
            const pdf = this.createPDFFromCanvas(canvas);
            const fileName = this.generateFileName(data.nome, curriculoState.getTemplate());
            
            pdf.save(fileName);
            NotificationManager.showSuccess(MESSAGES.SUCCESS.PDF_GENERATED);
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            NotificationManager.showError(MESSAGES.ERROR.PDF_GENERATION);
        }
    }

    static async generateCanvas(element) {
        return await html2canvas(element, {
            scale: PDF_CONFIG.SCALE,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });
    }

    static createPDFFromCanvas(canvas) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF(
            PDF_CONFIG.ORIENTATION, 
            'mm', 
            PDF_CONFIG.FORMAT
        );
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = PDF_CONFIG.IMG_WIDTH;
        const pageHeight = PDF_CONFIG.PAGE_HEIGHT;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        return pdf;
    }

    static generateFileName(nome, template) {
        const cleanName = StringUtils.createSlug(nome);
        const timestamp = new Date().toISOString().slice(0, 10);
        return `CV_${cleanName}_${template}_${timestamp}.pdf`;
    }
}

// ====== GLOBAL FUNCTIONS (for backward compatibility) ======
function addExperiencia() {
    DynamicFormComponents.addExperiencia();
}

function removeExperiencia(button) {
    DynamicFormComponents.removeExperiencia(button);
}

function addFormacao() {
    DynamicFormComponents.addFormacao();
}

function removeFormacao(button) {
    DynamicFormComponents.removeFormacao(button);
}

function addIdioma() {
    DynamicFormComponents.addIdioma();
}

function removeIdioma(button) {
    DynamicFormComponents.removeIdioma(button);
}

function atualizarPreview() {
    PreviewManager.updatePreview();
}

function changeTemplate() {
    EventHandlers.handleTemplateChange();
}

function downloadPDF() {
    EventHandlers.handleDownloadPDF();
}

// ====== APPLICATION INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Inicializar componentes
        FormManager.initialize();
        
        // Primeira atualização do preview
        PreviewManager.updatePreview();
        
        // Adicionar listeners globais
        const templateSelector = DOMUtils.getElementById('template-selector');
        if (templateSelector) {
            templateSelector.addEventListener('change', EventHandlers.handleTemplateChange);
        }
        
        const downloadBtn = DOMUtils.querySelector('.btn-primary');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', EventHandlers.handleDownloadPDF);
        }

        console.log('✅ Gerador de Currículo inicializado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar aplicação:', error);
        NotificationManager.showError(MESSAGES.ERROR.APP_INITIALIZATION);
    }
});
