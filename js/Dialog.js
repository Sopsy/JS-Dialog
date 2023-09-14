import Confirm from "./Confirm.js";

export default class Dialog
{
    #options;
    #elm;
    #titleElm;
    #contentElm;

    constructor(title, content, options = {})
    {
        if (typeof HTMLDialogElement !== 'function') {
            alert(_('Your browser does not support this feature. Please update your browser.'));

            return;
        }

        this.#options = Object.assign({}, {
            onClose: null,
            closeConfirm: false,
            closeConfirmText: _('Close this window?'),
            closeConfirmButtonText: _('Ok'),
            classes: []
        }, options);

        // Create modal element
        this.#elm = document.createElement('dialog');
        if (this.#options.classes.length !== 0) {
            this.#elm.classList.add(...this.#options.classes);
        }

        // Create title
        this.#titleElm = document.createElement('header');
        let titleTextElm = document.createElement('h3');
        titleTextElm.textContent = title;
        this.#titleElm.append(titleTextElm);

        // Create close button
        let closeButton = document.createElement('button');
        closeButton.classList.add('close', 'icon-cross');
        this.#bindCloseButton(closeButton);
        this.#titleElm.append(closeButton);

        this.#elm.append(this.#titleElm);

        // Create element for the content
        this.#contentElm = document.createElement('div');
        this.#contentElm.classList.add('content')
        if (content instanceof HTMLElement) {
            if ('content' in content) {
                this.#contentElm.append(content.content);
            } else {
                this.#contentElm.append(content);
            }
        } else {
            this.#contentElm.innerHTML = content;
        }

        this.#elm.append(this.#contentElm);
        document.body.prepend(this.#elm);
        window.dispatchEvent(new CustomEvent('dialog-open', {detail: this}));
        this.#elm.showModal();

        this.#elm.addEventListener('close', () => {
            window.dispatchEvent(new CustomEvent('dialog-close', {detail: this}));
            this.#elm.remove();
        });
    }

    element()
    {
        return this.#contentElm;
    }

    dialogElement()
    {
        return this.#elm;
    }

    returnValue()
    {
        return this.#elm.returnValue;
    }

    setContent(template)
    {
        if (!(template instanceof HTMLTemplateElement)) {
            throw new Error('setContent wants a HTMLTemplateElement');
        }

        this.#contentElm.replaceChildren(template.content);
    }

    setHtmlContent(content)
    {
        this.#contentElm.innerHTML = content;

        // Bind alternative close buttons
        for(let button of this.#elm.querySelectorAll('.close-dialog')) {
            this.#bindCloseButton(button)
        }
    }

    setCloseConfirm(confirm)
    {
        this.#options.closeConfirm = confirm;
    }

    forceClose(response = '')
    {
        this.#options.closeConfirm = false;
        this.close(response);
    }

    close(response = '')
    {
        this.#elm.close(response);
    }

    static closeParent(elm)
    {
        elm.closest('dialog')?.close();
    }

    #bindCloseButton(elm) {
        if (!elm instanceof HTMLElement) {
            return;
        }

        elm.addEventListener('click', async () => {
            if (!this.#options.closeConfirm ||
                await (new Confirm(this.#options.closeConfirmText, {ok: this.#options.closeConfirmButtonText})).response()) {

                this.#elm.close();
            }
        });
    }
}

Object.freeze(Dialog.prototype);