import { Model } from 'backbone'

export default class TodoModel extends Model {

    get defaults() {
        return {
            title: '',
            completed: false
        }
    }

    initialize() { }

    toggle() {
        this.save({
            completed: !this.get('completed')
        })
    }
    
}