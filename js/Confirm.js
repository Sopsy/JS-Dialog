export default class Confirm
{
    #options;
    #elm;
    #okButton;
    #cancelButton = null;
    #messageElm = null;

    constructor(message, options = {})
    {
        if (typeof HTMLDialogElement !== 'function') {
            alert(_('Your browser does not support this feature. Please update your browser.'));

            return;
        }

        this.#options = Object.assign({}, {
            cancel: _('Cancel'),
            ok: _('Ok')
        }, options);

        // Create confirm element
        this.#elm = document.createElement('dialog');
        this.#elm.classList.add('confirm');

        this.setMessage(message);

        this.#okButton = document.createElement('button');
        this.#okButton.classList.add('ok');
        this.#okButton.textContent = this.#options.ok;

        this.#okButton.addEventListener('click', () => {
            this.#elm.close('ok');
        }, {capture: true});

        let footer = document.createElement('footer');

        if (this.#options.cancel !== '') {
            this.#cancelButton = document.createElement('button');
            this.#cancelButton.classList.add('cancel');
            this.#cancelButton.textContent = this.#options.cancel;

            this.#cancelButton.addEventListener('click', () => {
                this.#elm.close('cancel');
            }, {capture: true});

            footer.append(this.#cancelButton);
        }

        footer.append(this.#okButton);
        this.#elm.append(footer);
        document.body.prepend(this.#elm);
        this.#elm.showModal();

        this.#elm.addEventListener('close', () => {
            this.#elm.remove();
        });
    }

    setMessage(message)
    {
        if (this.#messageElm) {
            this.#messageElm.remove();
        }

        if (message instanceof HTMLElement) {
            if ('content' in message) {
                this.#messageElm = message.content;
            } else {
                this.#messageElm = message;
            }
        } else {
            this.#messageElm = document.createElement('p');
            this.#messageElm.innerHTML = message;
        }

        this.#elm.prepend(this.#messageElm);
    }

    close(response = '')
    {
        this.#elm.close(response);
    }

    disable()
    {
        this.#okButton.disabled = true;
    }

    enable()
    {
        this.#okButton.disabled = false;
    }

    response()
    {
        return new Promise((resolve, reject) => {
            this.#elm.addEventListener('close', () => {
                if (this.#elm.returnValue === 'ok') {
                    resolve(true);
                }

                resolve(false);
            });
        });
    }
}

Object.freeze(Confirm.prototype);