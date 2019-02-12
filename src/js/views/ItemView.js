import { View } from 'backbone'
import _ from 'underscore'
import itemTemplate from './../../html/templates/item.html'

export default class ItemView extends View {

    get tagName() { return 'li' }
    get template() { return _.template(itemTemplate) }

    get events() {
        return {
            'click .edit': 'edit',
            'click .toggle': 'toggleCompleted',
            'click .destroy': 'clear',
            'keypress .edit': 'updateInEnter',
            'keypress .edit': 'cancelOnEscape',
            'blur .edit': 'close'
        }
    }

    initialize() {
        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'destroy', this.remove)
    }

    render() {
        if (this.model.changedAttributes()) return

        this.$el.html(this.template(this.model.toJSON()))
        this.$el.toggleClass('completed', this.model.get('completed'))
        this.$input = this.$('.edit')

        return this
    }

    edit() {
        this.$el.addClass('editing')
        this.$input.focus()
    }

    toggleCompleted() {
        this.model.toggle()
    }

    clear() {
        this.model.destroy()
    }

    close() {
        let text = this.$input.val().trim()

        if (text) {
            this.model.save({
                title: text
            })
        } else {
            this.clear()
        }

        this.$el.removeClass('editing')
    }

    updateOnEnter(e) {
        if (e.keyCode === 13) this.close()
    }

    cancelOnEscape(e) {
        if (e.keyCode === 27) {
            this.$input.val(this.model.get('title'))
            this.close()
        }
    }

}