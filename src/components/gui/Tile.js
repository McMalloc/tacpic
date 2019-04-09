import styled from 'styled-components';
import React, {Component} from "react";
import {p} from 'styled-components-spacing';

const Image = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.4s, background-image 0.4s;
`;

const ImageWrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  
  //&:after {
  //  background: linear-gradient(0deg, rgba(0,48,60,1) 0%, rgba(0,48,60,0.5) 30%, rgba(0,48,60,0) 50%); 
  //  position: absolute;
  //  content: " ";
  //  width: 100%;
  //  height: 100%;
  //  left: 0;
  //  top: 80%;
  //  transition: opacity 0.2s, top 0.2s;
  //}  
  
  &:hover:after {
    top:0;
  }
`;

const Title = styled.div`
    width: 100%;
    text-shadow: 1px 1px 0 ${props => props.theme.brand_secondary};
    background-color: ${props => props.theme.brand_secondary};
    ${p(2)};
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    text-align: center;
    transition: padding 0.2s;
    
    &:after {
      position: absolute;
      content: " ";
      width: 100%;
      height: 100%;
      border-top: 1px solid ${props => props.theme.brand_primary_light};
      left: -100%;
      top: 0;
      transition: left 0.4s;
    }
`;

const Container = styled.div`
  width: 100%;
  height: 250px;
  overflow: hidden;
  position: relative;
  background-color: ${props => props.theme.brand_secondary};
  box-shadow: ${props => props.theme.distant_shadow};
  border-radius: 5px;
  cursor: pointer;
  color: ${props => props.theme.brand_primary_light};
  
  &:after {
      position: absolute;
      content: '\\f061';
      //content: "hi";
      font-family: FontAwesome;
      font-size: 130%;
      ${p(2)};
      bottom: 0;
      left: -50px;
      opacity: 0;
      transition: opacity 0.2s, left 0.2s;
      color: ${props => props.theme.brand_primary_light};
    }
  
  &:hover {
    ${Image} { transform: scale(1.05); }  
      
    ${Title} { 
      //padding-left: 50px;
      
      &:after {
        left: 0;
      }
    }
    
    &:after { //Pfeil
      opacity: 1;
      //left: 0;
    }
  }
`;


class Tile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0
        };
        this.handleMousenter = this.handleMousenter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        // this.handleClick = this.handleClick.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // handleClick() {
    //     console.log("THIS tile was clicked");
    // }

    handleMousenter() {
        if (!Array.isArray(this.props.imgUrl)) return;
        setTimeout(() => {
            this.interval = setInterval(() => {
                let newIndex = this.state.imageIndex + 1;
                if (newIndex >= this.props.imgUrl.length) newIndex = 0;
                this.setState({
                    imageIndex: newIndex
                });
            }, 1000);
        }, 500);
    }

    onMouseLeave() {
        clearInterval(this.interval);
        this.setState({
            imageIndex: 0
        });
    }

    render() {
        return (
            <Container {...this.props} onClick={this.props.onClick}>
                <ImageWrapper onMouseEnter={this.handleMousenter} onMouseLeave={this.onMouseLeave}>
                    <Image src={Array.isArray(this.props.imgUrl) ? this.props.imgUrl[this.state.imageIndex] : this.props.imgUrl}/>
                </ImageWrapper>
                <Title>{this.props.title}</Title>
            </Container>
        )
    }
}

export {Tile}