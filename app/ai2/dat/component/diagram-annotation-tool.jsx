'use strict';

const React = require('react');
const HeaderAnnotationControls = require('./header-annotation-controls.jsx');
const ImageAnnotator = require('./image-annotator.jsx');
const ImageManager = require('../model/image-manager');
const ImageManagerEvent = require('../model/image-manager-event');
const AnnotationManagerEvent = require('../model/annotation-manager-event');
const AnnotationManager = require('../model/annotation-manager');
const Messages = require('./messages.jsx');
const KeyMaster = require('../util/key-master');
const KeyCode = require('../util/key-code');
const CategorySelector = require('./category-selector.jsx');
const RelationshipRestriction = require('../model/relationship-restrictions');
const MessageManager = require('../util/message-manager');



class DiagramAnnotationTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasImages: false };
    this.handleNewImageSet = this.handleNewImageSet.bind(this);
    this.saveAndAdvance = this.saveAndAdvance.bind(this);
    this.set_IntraObjectLabel= this.set_IntraObjectLabel.bind(this);
    this.set_IntraObjectLinkage= this.set_IntraObjectLinkage.bind(this);
    this.set_InterObjectLinkage= this.set_InterObjectLinkage.bind(this);
    this.set_IntraObjectLoop= this.set_IntraObjectLoop.bind(this);
    this.set_arrowDescriptor= this.set_arrowDescriptor.bind(this);
    this.set_intraObjectRegionLabel = this.set_intraObjectRegionLabel.bind(this);
    this.set_sectionTitle = this.set_sectionTitle.bind(this);
    this.set_imageTitle = this.set_imageTitle.bind(this);
    this.set_imageCaption = this.set_imageCaption.bind(this);
    this.set_textMisc = this.set_textMisc.bind(this);
    this.undoSingleClick= this.undoSingleClick.bind(this);
    this.undoGroup= this.undoGroup.bind(this);
    this.resetCurrent= this.resetCurrent.bind(this);
  }
  handleNewImageSet() {
    AnnotationManager.clear();
    if (ImageManager.getTotalFinishedImageCount() > 0) {
      this.setState({ hasImages: true });
    }
  }
  set_IntraObjectLinkage(){
    this.refs.cat_selector.hotKeyPressed('IntraObjectLinkage');
  }
  set_IntraObjectLabel(){
    this.refs.cat_selector.hotKeyPressed('IntraObjectLabel');
  }
  set_InterObjectLinkage(){
    this.refs.cat_selector.hotKeyPressed('InterObjectLinkage');
  }
  set_IntraObjectLoop(){
    this.refs.cat_selector.hotKeyPressed('IntraObjectLoop');
  }
  set_arrowDescriptor(){
    this.refs.cat_selector.hotKeyPressed('arrowDescriptor');
  }
  set_intraObjectRegionLabel(){
    this.refs.cat_selector.hotKeyPressed('intraObjectRegionLabel');
  }
  set_sectionTitle(){
    this.refs.cat_selector.hotKeyPressed('sectionTitle');
  }
  set_imageTitle(){
    this.refs.cat_selector.hotKeyPressed('imageTitle');
  }
  set_imageCaption(){
    this.refs.cat_selector.hotKeyPressed('imageCaption');
  }
  set_textMisc(){
    this.refs.cat_selector.hotKeyPressed('textMisc');
  }
  resetCurrent(){
    var cur_cat = AnnotationManager.getCurrentCategory();
    this.refs.cat_selector.setState({current_category: cur_cat});
  }
  undoSingleClick(){
    var last_annotation = AnnotationManager.getLastClicked();
    if(last_annotation.category.length > 1 && last_annotation.group_n.length > 1){
      AnnotationManager.undoClick();
    }
    this.resetCurrent();
    AnnotationManager.emit(AnnotationManagerEvent.MODE_CHANGED);
  }
  undoGroup(){
    if(AnnotationManager.getCurrentGroupNumber() > 1){
      AnnotationManager.undoGroup();
    }
    this.resetCurrent();
    AnnotationManager.emit(AnnotationManagerEvent.MODE_CHANGED);
  }
  componentDidMount() {
    ImageManager.on(ImageManagerEvent.NEW_IMAGES, this.handleNewImageSet);
    AnnotationManager.on(AnnotationManagerEvent.MODE_CHANGED, this.resetCurrent);
    KeyMaster.on(KeyCode.Enter, this.saveAndAdvance);
    KeyMaster.on(KeyCode.Advance_Question, this.advanceQuestionGroup);
    KeyMaster.on(KeyCode.arrowDescriptor, this.set_arrowDescriptor);
    KeyMaster.on(KeyCode.IntraObjectLinkage, this.set_IntraObjectLinkage);
    KeyMaster.on(KeyCode.IntraObjectLabel, this.set_IntraObjectLabel);
    KeyMaster.on(KeyCode.InterObjectLinkage, this.set_InterObjectLinkage);
    KeyMaster.on(KeyCode.IntraObjectLoop, this.set_IntraObjectLoop);
    KeyMaster.on(KeyCode.intraObjectRegionLabel, this.set_intraObjectRegionLabel);
    KeyMaster.on(KeyCode.sectionTitle, this.set_sectionTitle);
    KeyMaster.on(KeyCode.imageTitle, this.set_imageTitle);
    KeyMaster.on(KeyCode.imageCaption, this.set_imageCaption);
    KeyMaster.on(KeyCode.textMisc, this.set_textMisc);
    KeyMaster.on(KeyCode.Undo, this.undoSingleClick);
    KeyMaster.on(KeyCode.GUndo, this.undoGroup);
  }
  componentWillUnmount() {
    ImageManager.off(ImageManagerEvent.NEW_IMAGES, this.handleNewImageSet);
    KeyMaster.unmount();
    window.onbeforeunload = undefined;
  }
  renderView() {
    var view = <ImageAnnotator />;
    return view;
  }
  renderCategoryPicker(){
    var sidebar = <CategorySelector ref="cat_selector"/>;
    return sidebar;
  }
  populate_fields(name, val){
    var form = document.forms[0];
    form[name].value=val;
  }
  saveAndAdvance() {
    var image_id = ImageManager.getCurrentImageId();
    var annotation_map = AnnotationManager.getAnnotations(image_id);
    var annotation_results = AnnotationManager.saveAnnotations(image_id, annotation_map);
    this.populate_fields('results', annotation_results);
    var form = document.forms[0];
    form.submit();
  }
  advanceQuestionGroup() {
    var current_cat = AnnotationManager.getCurrentCategory();
    if(AnnotationManager.getCurrentGroupLength() == RelationshipRestriction[current_cat]){
      AnnotationManager.advanceCurrentGroupNumber();
      AnnotationManager.resetCurrentClickNumber();
    }
    else{
      MessageManager.warn("Not enough constituents to save " + current_cat);
    }
  }
  cancelDragOver(event) {
    event.preventDefault();
  }
  getHITParams() {
    var params = ImageManager.getUrlParams();
    return params
  }
  render() {
    var url_params = this.getHITParams();
    var view = this.renderView();
    var sidebar = this.renderCategoryPicker();
    var cur_image_params = ImageManager.getUrlParams();
    var image_base = ImageManager.base_url;
    var cur_image_url = image_base + cur_image_params.url
    return (
      <div className="diagram-annotation-tool"
          onDragOver={this.cancelDragOver}>
        <header className="padded flex-row">
          <h1 className=" flex-align-left">Diagram Annotation Tool</h1>
          <button onClick={this.advanceQuestionGroup} className="btn-red">[S] Save Relationship</button>
        <p>
          &emsp;
        </p>
         <button onClick={this.saveAndAdvance} className="btn-green">Save Image and Advance</button>
          <a href={cur_image_url}
            target="_blank" className="review_instructions flex-align-right">
            <strong>original image</strong>
          </a>
          <a href="http://allenai.org" target="_blank" className="made-by-ai2 flex-align-right">
            <strong>Made By:</strong>
            <img src="assets/images/logo@2x.png" width="33" height="25" alt="AI2" />
          </a>
        </header>
        <main>
          <Messages />
          {sidebar}
          {view}
        </main>
          <div className="flex-align-right">
            <form action= "https://workersandbox.mturk.com/mturk/externalSubmit"
                  method="POST">
              <input type="hidden" name="assignmentId" id="myAssignmentId" value={url_params.assignmentId} />
              <input type="hidden" name="image_id" id="image_id" value = {url_params.url}/>
              <input type="hidden" name="results" id="results" value = "" />
            </form>
          </div>
      </div>
    );
  }
}

// <form action= "https://workersandbox.mturk.com/mturk/externalSubmit"
// <form action="https://www.mturk.com/mturk/externalSubmit"
module.exports = DiagramAnnotationTool;
