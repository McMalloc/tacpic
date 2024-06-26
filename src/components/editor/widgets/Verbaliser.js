import React, {useEffect, useState} from 'react';
import styled from 'styled-components/macro';
import {Button} from "../../gui/Button";
import StepIndicator from "../../gui/StepIndicator";
import {Multiline, Textinput} from "../../gui/Input";
import {CHANGE_IMAGE_DESCRIPTION, CHANGE_PAGE_CONTENT} from "../../../actions/action_constants";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const updateContent = (dispatch, blocks) => {
    dispatch({
        type: CHANGE_IMAGE_DESCRIPTION,
        imageDescription: blocks
    })
}

const steps = [
    "editor:braillePanel.verbalise_type-of-graphic", 
    "editor:braillePanel.verbalise_summary", 
    "editor:braillePanel.verbalise_details"];

const Verbaliser = props => {
    const dispatch = useDispatch();
    const imageDescription = useSelector(state => state.editor.file.present.braillePages.imageDescription);
    const {t} = useTranslation();
    const [step, setStep] = useState(0);
    const buttonLabel = function() {
        if (step === 0) return t("editor:braillePanel.verbaliseToSummaryButtonLabel");
        if (step === 1) return t("editor:braillePanel.verbaliseToDetailsButtonLabel");
        if (step === 2) return t("done");
    }();

    const [type, setType] = useState(imageDescription.type);
    const [summary, setSummary] = useState(imageDescription.summary);
    const [details, setDetails] = useState(imageDescription.details);

    useEffect(() => {
        updateContent(dispatch, {type, summary, details});
    }, [type, summary, details]);

    useEffect(() => {
        props.redrawCallback();
    }, [step]);

    return (
        <>
            <StepIndicator navigationable={setStep} steps={steps} current={step}/>
            {step === 0 &&
            <>
                <p>{t("editor:braillePanel.verbalise_type-of-graphic-hint")}</p>
                <Textinput
                    value={type}
                    onChange={event => setType(event.target.value)}
                    label={"editor:braillePanel.verbalise_type-of-graphic"}/>
            </>
            }
            {step === 1 &&
            <>
                <p>{t("editor:braillePanel.verbalise_summary-hint")}</p>
                <Multiline rows={3}
                           value={summary}
                           onChange={event => setSummary(event.target.value)}
                           label={"editor:braillePanel.verbalise_summary"}/>
            </>
            }
            {step === 2 &&
            <>
                <p>{t("editor:braillePanel.verbalise_details-hint")}</p>
                <Multiline rows={8}
                           value={details}
                           onChange={event => setDetails(event.target.value)}
                           label={"editor:braillePanel.verbalise_details"}/>
            </>
            }

            <ButtonWrapper>
                <Button label={'back'} disabled={step <= 0} onClick={() => setStep(Math.max(0, step - 1))} />

                <Button icon={"arrow-right"} onClick={() => {
                    if (step + 1 === steps.length) {
                        props.closeSelf(); return;
                    }
                    setStep(Math.min(steps.length - 1, step + 1))
                }} primary label={buttonLabel}/>
            </ButtonWrapper>
        </>
    );

}

export default Verbaliser;