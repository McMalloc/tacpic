import React, {Component} from 'react';
import {connect} from "react-redux";

class Objects extends Component {

    render() {
        return (
            <React.Fragment>
                <select multiple={true}>
                {this.props.objects.map((object, i) =>
                    <option key={i}>
                        {/*<i className="fa fa-eye"></i> */}
                        {object.type}
                        {/*<i className="fas fa-lock-open"></i>*/}
                    </option>
                )}
                </select>
                <label>
                    <input checked onChange={() => {}} type={'checkbox'} /> Zeige Druck
                </label>
                <label>
                    <input checked onChange={() => {}} type={'checkbox'} /> Zeige Relief
                </label>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        objects: state.canvas.objects
    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Objects);