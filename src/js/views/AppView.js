import { View } from 'backbone'
import _ from 'underscore'
import statsTemplate from './../../html/templates/stats.html'
import Todos from './../collections/TodosCollection'
import ItemView from './ItemView'

export default class AppView extends View {

    get el() { return '.todoApp' }
    get template() { return _.template(statsTemplate) }

    get events() {
        return {
            'click .toggleCompleted': 'toggleCompleted',
            'blur .newItem': 'create',
            'keypress .newItem': 'createOnEnter',
            'click .clearCompleted': 'clearCompleted'
        }
    }

    initialize() {

        this.$input = this.$('.newItem')
        this.$main = this.$('.main')
        this.$footer = this.$('.footer')
        this.$listActive = this.$('.listActive')
        this.$listCompleted = this.$('.listCompleted')

        this.listenTo(Todos, 'add', this.addOne)
        // this.listenTo(Todos, 'reset', this.addAll)
        this.listenTo(Todos, 'all', this.render)

        // Todos.fetch({ reset: true })
    }

    render() {
        let completed = Todos.completed().length
        let remaining = Todos.remaining().length

        if (Todos.length) {
            this.$main.show()
            this.$footer.show()

            this.$footer.html(this.template({
                completed: completed,
                remaining: remaining
            }))

        } else {
            this.$main.hide()
            this.$footer.hide()
        }
    }

    create() {
        let text = this.$input.val().trim()

        if (text) {
            Todos.create({
                title: text,
                order: Todos.order()
            })

            this.$input.val('')
        }
    }

    createOnEnter(e) {
        if (e.keyCode === 13) this.create()
    }

    clearCompleted() {
        _.invoke(Todos.completed(), 'destroy')
    }

    addOne(todo) {
        let item = new ItemView({ model: todo })
        this.$listActive.append(item.render().el)
    }

    toggleCompleted() {
        if (this.$('.toggleCompleted').hasClass('extended')) {
            this.$listCompleted.hide()
        } else {
            this.$listCompleted.show()
        }
        this.$('.toggleCompleted').toggleClass('extended')
    }
}