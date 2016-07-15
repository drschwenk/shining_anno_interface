'use strict';

const React = require('react');

const AnnotationManager = require('../model/annotation-manager');
const ImageManager = require('../model/image-manager');
const Radium = require('radium');
const CategoryButton = require('./category-button.jsx');

class CategorySelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {current_category: AnnotationManager.getCurrentCategory()}
        this.handleClickEvent = this.handleClickEvent.bind(this);
    }

    hotKeyPressed(keyed_category){
      this.handleClickEvent(keyed_category);
    }
    handleClickEvent(selected_category){
        AnnotationManager.setCurrentCategory(selected_category);
        this.setState({current_category: selected_category});
    }
    render() {
        var header_button = <CategoryButton
          category={'IntraObjectLinkage'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'1'}
          />;
        var discussion_button = <CategoryButton
          category={'IntraObjectLabel'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'2'}
          />;
        var question_button = <CategoryButton
          category={'InterObjectLinkage'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'3'}
          />;
        var label_button = <CategoryButton
          category={'IntraObjectLoop'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'4'}
          />;
        var answer_button = <CategoryButton
          category={'arrowDescriptor'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'5'}
          />;
        var relationship_number = AnnotationManager.getCurrentGroupNumber();
        var component_number = AnnotationManager.getCurrentClickNumber();

        return (
        <div className="annotation-pane-dialog-header">
            <span>Select Category</span>
            <div className="annotation-pane-dialog-content">
              {header_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {discussion_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {question_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {label_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {answer_button}
            </div>
            <p className="flex-align-center">current relationship number</p>
            <p className="flex-align-center">   {relationship_number}</p>
            <p className="flex-align-center">current number</p>
            <p className="flex-align-center">   {component_number}</p>
          </div>
    );
    }
}

module.exports = CategorySelector;
