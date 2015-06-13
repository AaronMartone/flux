/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');
var TodoTextInput = require('./TodoTextInput.react');

var cx = require('react/lib/cx');

var TodoItem = React.createClass({

  propTypes: {
   todo: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isEditing: false
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var todo = this.props.todo;

    var input;
    if (this.state.isEditing) {
      input =
        <TodoTextInput
          className="edit"
          onSave={this._onSave}
          value={todo.text}
        />;
    }

    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    return (
      <li
        className={cx({
          'completed': todo.complete,
          'editing': this.state.isEditing,
          'format-uppercase': (todo.caseFormat === 1),
          'format-lowercase': (todo.caseFormat === 2),
          'format-titlecase': (todo.caseFormat === 3)
        })}
        key={todo.id}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.complete}
            onChange={this._onToggleComplete}
          />
          <label onDoubleClick={this._onDoubleClick}>
            {this.caseFormat(todo.text, todo.caseFormat)}
          </label>
          <button className="cycleCase" onClick={this._onCycleCase} />
          <button className="destroy" onClick={this._onDestroyClick} />
        </div>
        {input}
      </li>
    );
  },

  caseFormat: function(text, format) {
    switch (format) {
      case 0:
        return text;
        break;
      case 1:
        return text.toUpperCase();
        break;
      case 2:
        return text.toLowerCase();
        break;
      case 3:
        var words = text.toLowerCase().split(' ');
        words = words.map(function(word) {
          return word.charAt(0).toUpperCase() + word.substr(1);
        });
        return words.join(' ');
        break;
    }
  },

  _onToggleComplete: function() {
    TodoActions.toggleComplete(this.props.todo);
  },

  _onDoubleClick: function() {
    this.setState({isEditing: true});
  },

  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param  {string} text
   */
  _onSave: function(text) {
    TodoActions.updateText(this.props.todo.id, text);
    this.setState({isEditing: false});
  },

  _onDestroyClick: function() {
    TodoActions.destroy(this.props.todo.id);
  },

  _onCycleCase: function() {
    console.log('TODOITEM > _onCycleCase()');
    console.log('Calling TODOACTIONS cycleCase() with id:' + this.props.todo.id);
    TodoActions.cycleCase(this.props.todo.id);
  }

});

module.exports = TodoItem;
