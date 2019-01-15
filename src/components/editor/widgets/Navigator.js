import React, {Component} from 'react';
import {connect} from "react-redux";

class Navigator extends Component {

    render() {
        return (
            <React.Fragment>
                <img alt={'map'}/>
                <button className="fa fa-plus"></button>
                <select>
                    <option>50%</option>
                    <option>100%</option>
                    <option>150%</option>
                </select>
                <button className="fa fa-minus"></button>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {

    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);