import { Collection } from 'backbone'
import TodoModel from './../models/TodoModel'
import { LocalStorage } from 'backbone.localstorage'

class TodosCollection extends Collection {

    get model() { return TodoModel }
    get localStorage() { return new LocalStorage('todos') }
    get comparator() { return 'order' }

    initialize() { }

    completed() {
        return this.where({ completed: true })
    }

    remaining() {
        return this.where({ completed: false })
    }

    order() {
        return this.length ? this.last().get('order') + 1 : 1
    }

}

export default new TodosCollection()