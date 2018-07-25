import React, {Component} from 'react';
import {connect} from "react-redux";
import {createApiAction} from "../../actions/api_actions";
import {PAGE} from "../../actions/constants";

class Page extends Component {
    componentDidMount() {
        this.props.getPage(this.props.pageId);
    }

    render() {
        return (
            <div
                dangerouslySetInnerHTML={{__html: this.props.content}}
                style={{border: '1px solid red'}}>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        content: state.pages[props.pageId]
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPage: (id) => {
            return dispatch(createApiAction(PAGE.GET.REQUEST, id));
        }
    }
};

// export default Login;
export default connect(mapStateToProps, mapDispatchToProps)(Page);