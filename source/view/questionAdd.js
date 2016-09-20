import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import * as ConfigAction from '../action/config';
import * as UserAction from '../action/user';
import { getImageSource, numberValidator } from '../common';
import { Base64 } from '../common/base64';
import Navbar from '../component/navbar';
import Toast from '../component/toast';
import Spinner from '../component/spinner';
import { StyleConfig, ComponentStyles, CommonStyles } from '../style';

const navTitle = "新增博问";
const backgroundImageSource = getImageSource(15);

class QuestionAddPage extends Component {

  constructor (props) {
    super(props);
    this.state = {
      questionTitle:'',
      questionContent:'',
      questionTags:'',
      questionFlags:''
    }
  }

  questionValidator(){
    let questionTitle = this.state.questionTitle,
        questionContent = this.state.questionContent,
        questionFlags = this.state.questionFlags || 0,
        message;
    if(!_.trim(questionTitle)){
        message = "请输入博问标题";
    }
    else if(!_.trim(questionContent)){
        message = "请输入博问详情";
    }
    else if(!numberValidator(questionFlags)){
        message = "请输入正确的悬赏积分";
    }
    if(message){
       this.refs.toast.show({
         message: message
       });
       return false;
    }
    return {
      Title: questionTitle,
      Content: questionContent,
      Flags: questionFlags
    };
  }

  onQuestionSendPress(){
    let questionData = this.questionValidator();
    if(questionData){
        console.info("onQuestionSendPress");
        console.info(questionData);
    }
  }

  renderNavbar(){
    return (
      <Navbar
        title={ navTitle }
        leftIconName = { "ios-arrow-round-back" }
        leftIconOnPress={ ()=>this.props.router.pop() }/>
    )
  }

  renderQuestionTitle(){
    return (
          <View>
              <View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween, CommonStyles.p_a_3, ComponentStyles.panel_bg ]}>
                <Text style={[CommonStyles.text_gray, CommonStyles.font_xs]}>
                  博问标题
                </Text>
              </View>
              <View  style={[ CommonStyles.p_a_3 ]}>
                <TextInput 
                    ref="txtTitle"
                    maxLength = { 80 }
                    multiline = { true }
                    style={ [ComponentStyles.input, styles.txtQuestionTitle] }
                    placeholder={'请输入博问标题...'}
                    placeholderTextColor={ StyleConfig.color_gray }
                    underlineColorAndroid = { 'transparent' }
                    onChangeText = {(val)=>this.setState({questionTitle: val})}
                    value={ this.state.questionTitle } />
              </View>
          </View>
      )
  }

  renderQuestionContent(){
      return (
          <View>
            <View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween, CommonStyles.p_a_3, ComponentStyles.panel_bg ]}>
                <Text style={[CommonStyles.text_gray, CommonStyles.font_xs]}>
                  博问详情
                </Text>
            </View>
            <View style={[ CommonStyles.p_a_3 ]}>
                <TextInput 
                    ref="txtContent"
                    maxLength = { 1000 }
                    multiline = { true }
                    style={ [ComponentStyles.input, styles.txtQuestionContent] }
                    placeholder={'请输入博问详情...'}
                    placeholderTextColor={ StyleConfig.color_gray }
                    underlineColorAndroid = { 'transparent' }
                    onChangeText = {(val)=>this.setState({questionContent: val})}
                    value={ this.state.questionContent } />
            </View>
          </View>
      )
  }

  renderQuestionFlags(){
     return (
        <View>
          <View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween, CommonStyles.p_a_3, ComponentStyles.panel_bg ]}>
              <Text style={[CommonStyles.text_gray, CommonStyles.font_xs]}>
                悬赏积分
              </Text>
          </View>
          <View style={[ CommonStyles.p_a_3 ]}>
            <TextInput 
                ref="txtFlags"
                maxLength = { 5 }
                multiline = { false }
                style={ [ComponentStyles.input] }
                placeholder={'请输入悬赏积分，不输入则默认为0'}
                placeholderTextColor={ StyleConfig.color_gray }
                underlineColorAndroid = { 'transparent' }
                onChangeText = {(val)=>this.setState({questionFlags: val})}
                value={ this.state.questionFlags } />
          </View>
        </View>
     )
  }

  renderUserInfo(){
    return (
         <View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle ]}>
            <Image ref={view => this.imgView=view}
              style={ [ ComponentStyles.avatar_mini, CommonStyles.m_r_2] }
              source={ {uri: 'http://123.56.135.166/cnblog/public/img/common/author.jpg' } }>
            </Image>
            <Text style={ [ CommonStyles.text_gray, CommonStyles.font_xs ] }>
              愤怒的晃晃
            </Text>
        </View>
    )
  }

  renderSendButton(){
    return (
      <TouchableOpacity
            activeOpacity={ StyleConfig.touchable_press_opacity }
            style={[ ComponentStyles.btn, ComponentStyles.btn_sm, ComponentStyles.btn_danger_outline ]}
            onPress={()=>this.onQuestionSendPress()}>
            <Text style={[ComponentStyles.btn_text, CommonStyles.text_danger, CommonStyles.font_xs]}>
              提交
            </Text>
        </TouchableOpacity>
    )
  }

  renderQuestionOp(){
    return (
        <View style={[ CommonStyles.flexRow, CommonStyles.flexItemsMiddle, CommonStyles.flexItemsBetween, CommonStyles.p_a_3, ComponentStyles.panel_bg ]}>
          { this.renderUserInfo() }
          { this.renderSendButton() }
        </View>
    )
  }

  renderPending(){
    if(this.state.pending === true){
      return (
        <Spinner style={ ComponentStyles.pending_container }/>
      )
    }
  }

  render() {
    return (
      <View style={ ComponentStyles.container }>
        { this.renderNavbar() }
        { this.renderQuestionTitle()}
        { this.renderQuestionFlags()}
        { this.renderQuestionContent() }
        { this.renderQuestionOp() }
        { this.renderPending() }
        <Toast ref="toast"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txtQuestionTitle:{
    width: StyleConfig.screen_width - ( StyleConfig.space_3 * 2 ),
    height: 40,
    lineHeight: 32,
    textAlign: "left", 
    textAlignVertical: "top"
  },
  txtQuestionContent:{
    width: StyleConfig.screen_width - ( StyleConfig.space_3 * 2 ),
    height: StyleConfig.screen_height / 5,
    textAlign: "left", 
    textAlignVertical: "top"
  }
})

export default connect((state, props) => ({

}), dispatch => ({ 

}), null, {
  withRef: true
})(QuestionAddPage);