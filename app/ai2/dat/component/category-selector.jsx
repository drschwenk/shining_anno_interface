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
        var InterObjectLinkage_button = <CategoryButton
          category={'InterObjectLinkage'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'1'}
          />;
        var IntraObjectLabel_button = <CategoryButton
          category={'IntraObjectLabel'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'2'}
          />;
        var arrowDescriptor_button = <CategoryButton
          category={'arrowDescriptor'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'3'}
          />;
        var IntraObjectLinkage_button = <CategoryButton
          category={'IntraObjectLinkage'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'4'}
          />;
        var IntraObjectLoop_button = <CategoryButton
          category={'IntraObjectLoop'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'5'}
          />;
        var intraObjectRegionLabel_button = <CategoryButton
            category={'intraObjectRegionLabel'}
            current_category={this.state.current_category}
            onClickEvent={this.handleClickEvent}
            hotKeyNumber={'6'}
            />;
          var sectionTitle_button = <CategoryButton
            category={'sectionTitle'}
            current_category={this.state.current_category}
            onClickEvent={this.handleClickEvent}
            hotKeyNumber={'7'}
            />;
          var imageTitle_button = <CategoryButton
            category={'imageTitle'}
            current_category={this.state.current_category}
            onClickEvent={this.handleClickEvent}
            hotKeyNumber={'8'}
            />;
          var imageCaption_button= <CategoryButton
            category={'imageCaption'}
            current_category={this.state.current_category}
            onClickEvent={this.handleClickEvent}
            hotKeyNumber={'9'}
            />;

          var textMisc_button = <CategoryButton
            category={'textMisc'}
            current_category={this.state.current_category}
            onClickEvent={this.handleClickEvent}
            hotKeyNumber={'0'}
            />;
        var relationship_number = AnnotationManager.getCurrentGroupNumber();
        var component_number = AnnotationManager.getCurrentClickNumber();

        return (
        <div className="annotation-pane-dialog-header">
            <span>Select Category</span>
            <div className="annotation-pane-dialog-content">
              {InterObjectLinkage_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {IntraObjectLabel_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {arrowDescriptor_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {IntraObjectLinkage_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {IntraObjectLoop_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {intraObjectRegionLabel_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {sectionTitle_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {imageTitle_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {imageCaption_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {textMisc_button}
            </div>
            <p className="flex-align-center">rel= {relationship_number} cn= {component_number}</p>
          </div>
    );
    }
}

module.exports = CategorySelector;
