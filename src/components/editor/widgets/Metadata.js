import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';
import {Multiline, Textinput} from "../../gui/Input";
import Select from "../../gui/Select";
import {Button} from "../../gui/Button";
import {Checkbox} from "../../gui/Checkbox";

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const Status = styled.div`
  display: flex;
  justify-content: space-between;
    align-items: baseline;
  margin: ${props => props.theme.spacing[3]} 0;
`;

const Indicator = styled.span`
  display: inline-block;
  text-transform: uppercase;
  color: ${props => props.theme.background};
  font-size: 0.8em;
  letter-spacing: 2px;
  border-radius: ${props => props.theme.border_radius};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background-color: ${props => {
    switch (props.state) {
        case 0:
            return props.theme.info;
        case 1:
            return props.theme.success;
        case 2:
            return props.theme.warning;
        default:
            return props.theme.midlight;
    }
}};
  
`;

class Metadata extends Component {
    render() {
        return (
            <Wrapper>
                <div>
                    <Textinput label={"editor:input_catalogue-title"} sublabel={"editor:input_catalogue-title-sub"}/>
                    <Select label={"editor:input_catalogue-tags"} sublabel={"editor:input_catalogue-tags-sub"}/>
                    <Multiline label={"editor:input_catalogue-desc"} sublabel={"editor:input_catalogue-desc-sub"}/>

                </div>

                <div>
                    <hr/>
                    <Status>
                        <span>Status:</span>
                        <Indicator state={this.props.documentState}>
                            {/*editor:catalogue-state-{this.props.documentState}*/}
                            Entwurf
                            </Indicator>
                    </Status>
                    <p>Ich stimme der Veröffentlichung unter der liberalen CC-BY-SA 3.0 Lizenz zu.</p>
                    <Button primary fullWidth>editor:input_catalogue-publish</Button>
                </div>
            </Wrapper>
        );
    }
}

const mapStateToProps = state => {
    return {
        documentState: 0 // 0 = draft, 1 = published, 2 = published with new draft
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Metadata);