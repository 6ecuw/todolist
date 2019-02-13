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
            'focus .newItem': 'create',
            'click .toggleCompleted': 'toggleCompleted',
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
        this.$toggleCompleted = this.$('.toggleCompleted')

        this.listenTo(Todos, 'add', this.addOne)
        this.listenTo(Todos, 'reset', this.addAll)
        this.listenTo(Todos, 'change:completed', this.addAll)
        this.listenTo(Todos, 'all', this.render)

        Todos.fetch({ reset: true })
    }

    render() {        
        let completed = Todos.completed().length

        if (completed) {
            this.$toggleCompleted.html(this.template({
                completed: completed
            }))
        } else {
            this.$toggleCompleted.html('')
        }
    }

    create() {
        Todos.create({
            order: Todos.order()
        })
    }

    createOnEnter(e) {
        if (e.keyCode === 13) this.create()
    }

    clearCompleted() {
        _.invoke(Todos.completed(), 'destroy')
    }

    addOne(todo) {       
        let view = new ItemView({ model: todo })
        let item = view.render().el
        
        if (todo.get('completed')) {
            this.$listCompleted.append(item)
        } else {
            this.$listActive.append(item)
        }

        if (todo.get('title') === '') {
            item.querySelector('.edit').focus()
        }
    }
    
    addAll() {
        this.$listActive.html('')
        this.$listCompleted.html('')
        Todos.each(this.addOne, this)
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