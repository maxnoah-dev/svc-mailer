import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars'; 

class TemplateService {
    private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

    async loadTemplate(templateId: string): Promise<HandlebarsTemplateDelegate> {
        if (this.templates.has(templateId)) {
            return this.templates.get(templateId)!;
        }

        try {
            const templatePath = path.join(__dirname, '../templates', `${templateId}.hbs`);
            console.log('Looking for template at:', templatePath);
            const templateContent = fs.readFileSync(templatePath, 'utf8');
            const template = Handlebars.compile(templateContent);

            this.templates.set(templateId, template);
            return template;
        } catch (error) {
            console.error('Template path error:', error);
            throw new Error(`Template ${templateId} not found`);
        }
    }

    async renderTemplate(templateId: string, vars: Record<string, any>): Promise<string> {
        const template = await this.loadTemplate(templateId);
        return template(vars);
    }
}

export default new TemplateService();