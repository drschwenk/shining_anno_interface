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


class DiagramAnnotationTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasImages: false };
    this.handleNewImageSet = this.handleNewImageSet.bind(this);
    this.saveAndAdvance = this.saveAndAdvance.bind(this);
    this.set_discussion= this.set_discussion.bind(this);
    this.set_header= this.set_header.bind(this);
    this.set_definition= this.set_definition.bind(this);
    this.set_question= this.set_question.bind(this);
    this.set_answer= this.set_answer.bind(this);
    this.set_unlabeled= this.set_unlabeled.bind(this);
    this.undoSingleClick= this.undoSingleClick.bind(this);
    this.resetCurrent= this.resetCurrent.bind(this);
  }
  handleNewImageSet() {
    AnnotationManager.clear();
    if (ImageManager.getTotalFinishedImageCount() > 0) {
      this.setState({ hasImages: true });
    }
  }
  set_header(){
    AnnotationManager.setCurrentCategory('IntraObjectLinkage');
    this.refs.cat_selector.setState({current_category: ''});
  }
  set_discussion(){
    AnnotationManager.setCurrentCategory('IntraObjectLabel');
    this.refs.cat_selector.setState({current_category: 'Discussion'});
  }
  set_definition(){
    AnnotationManager.setCurrentCategory('InterObjectLinkage');
    this.refs.cat_selector.setState({current_category: 'Definition'});
  }
  set_question(){
    AnnotationManager.setCurrentCategory('Unlabeled');
    this.refs.cat_selector.setState({current_category: 'Question'});
  }
  set_answer(){
    AnnotationManager.setCurrentCategory('IntraObjectLoop');
    this.refs.cat_selector.setState({current_category: 'Answer'});
  }
  set_unlabeled(){
    AnnotationManager.setCurrentCategory('arrowDescriptor');
    this.refs.cat_selector.setState({current_category: 'Unlabeled'});
  }
  undoSingleClick(){
    var last_annotation = AnnotationManager.getLastClicked();
    console.log(last_annotation);
    if(last_annotation.category.length > 1 && last_annotation.group_n.length > 1){
      last_annotation.category.pop();
      last_annotation.group_n.pop();
      AnnotationManager.undoClick();
    }
    console.log(last_annotation);
    this.resetCurrent();
  }
  resetCurrent(){
    var cur_cat = AnnotationManager.getCurrentCategory();
    this.refs.cat_selector.setState({current_category: cur_cat});
  }
  componentDidMount() {
    ImageManager.on(ImageManagerEvent.NEW_IMAGES, this.handleNewImageSet);
    AnnotationManager.on(AnnotationManagerEvent.MODE_CHANGED, this.resetCurrent);
    KeyMaster.on(KeyCode.Enter, this.saveAndAdvance);
    KeyMaster.on(KeyCode.Advance_Question, this.advanceQuestionGroup);
    KeyMaster.on(KeyCode.Unlabeled, this.set_unlabeled);
    KeyMaster.on(KeyCode.Header_Topic, this.set_header);
    KeyMaster.on(KeyCode.Discussion, this.set_discussion);
    KeyMaster.on(KeyCode.Definition,this.set_definition);
    KeyMaster.on(KeyCode.Question, this.set_question);
    KeyMaster.on(KeyCode.Answer, this.set_answer);
    KeyMaster.on(KeyCode.Undo, this.undoSingleClick);
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
    AnnotationManager.advanceCurrentGroupNumber();
    AnnotationManager.resetCurrentClickNumber();
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
    return (
      <div className="diagram-annotation-tool"
          onDragOver={this.cancelDragOver}>
        <header className="padded flex-row">
          <h1 className=" flex-align-left">Textbook Annotation Tool</h1>
          <button onClick={this.advanceQuestionGroup} className="btn-red">q) Save Question</button>
        <p>
          &emsp;
        </p>
         <button onClick={this.saveAndAdvance} className="btn-green">Save Page and Advance</button>
          <a href="https://s3-us-west-2.amazonaws.com/ai2-vision-turk-data/textbook-annotation-test/question_hit_instructions/instructions.html"
            target="_blank" className="review_instructions flex-align-right">
            <strong>Read Instructions Here</strong>
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
