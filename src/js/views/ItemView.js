import { View } from 'backbone'
import _ from 'underscore'
import itemTemplate from './../../html/templates/item.html'

export default class ItemView extends View {

    get tagName() { return 'li' }
    get template() { return _.template(itemTemplate) }

    get events() {
        return {
            'focus .edit': 'edit',
            'click .edit': 'edit',
            'click .toggle': 'toggleCompleted',
            'click .destroy': 'clear',
            'keypress .edit': 'updateAndCreateOnEnter',
            'keydown .edit': 'cancelOnEscapeOrSwitchOnTab',
            'blur .edit': 'close'
        }
    }

    initialize() {
        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'destroy', this.remove)
    }

    render() {
        if (this.model.changed.id !== undefined) return
        
        this.$el.html(this.template(this.model.toJSON()))
        this.$el.toggleClass('completed', this.model.get('completed'))
        this.$input = this.$('.edit')
        
        return this
    }

    edit() {
        this.$el.addClass('editing')
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

    updateAndCreateOnEnter(e) {
        if (e.which === 13) {
            this.close()
            document.querySelector('.newItem').focus()
        }
    }
    
    cancelOnEscapeOrSwitchOnTab(e) {       
        if (e.which === 27) {
            this.$input.val(this.model.get('title'))
            this.close()
        }
        
        if (e.which === 9) {
            e.preventDefault()
            this.close()
            let nextItem = this.$el.next().find('.edit')[0]
            nextItem.select()
            nextItem.setSelectionRange(nextItem.value.length, nextItem.value.length)
        }
    }

}