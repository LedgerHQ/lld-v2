// @flow

import React, { PureComponent } from "react";
import invariant from "invariant";
import { withTranslation } from "react-i18next";

import { ModalBody } from "~/renderer/components/Modal";
import Breadcrumb from "./Breadcrumb";

export type StepProps = {
  t: *,
  transitionTo: string => void,
};

export type Step = {
  id: string,
  label: string,
  excludeFromBreadcrumb?: boolean,
  component: StepProps => React$Node,
  footer: StepProps => React$Node,
  shouldRenderFooter?: StepProps => boolean,
  shouldPreventClose?: boolean | (StepProps => boolean),
  onBack?: StepProps => void,
  noScroll?: boolean,
};

export type TypedStep<T> = {
  id: T,
  label: string,
  excludeFromBreadcrumb?: boolean,
  component: StepProps => React$Node,
  footer: StepProps => React$Node,
  shouldRenderFooter?: StepProps => boolean,
  shouldPreventClose?: boolean | (StepProps => boolean),
  onBack?: StepProps => void,
  noScroll?: boolean,
};

type State = {
  stepId: string,
};

type Props = {
  t: *,
  title: string,
  steps: Step[],
  initialStepId: string,
  hideBreadcrumb?: boolean,
  onClose: void => void,
  onStepChange?: Step => void,
  disabledSteps?: number[],
  errorSteps?: number[],
  children: any,
  error?: Error,
  signed?: boolean,
};

class Stepper extends PureComponent<Props, State> {
  state = {
    stepId: this.props.initialStepId,
  };

  transitionTo = stepId => {
    const { onStepChange, steps } = this.props;
    this.setState({ stepId });
    if (onStepChange) {
      const stepIndex = steps.findIndex(s => s.id === stepId);
      const step = steps[stepIndex];
      if (step) {
        onStepChange(step);
      }
    }
  };

  render() {
    const {
      t,
      hideBreadcrumb,
      steps,
      title,
      onClose,
      disabledSteps,
      errorSteps,
      children,
      ...props
    } = this.props;
    const { stepId } = this.state;

    const stepIndex = steps.findIndex(s => s.id === stepId);
    const step = steps[stepIndex];

    const visibleSteps = steps.filter(s => !s.excludeFromBreadcrumb);
    const indexVisible = Math.min(
      steps.slice(0, stepIndex).filter(s => !s.excludeFromBreadcrumb).length,
      visibleSteps.length - 1,
    );

    invariant(step, `Stepper: step ${stepId} doesn't exists`);

    const {
      component: StepComponent,
      footer: StepFooter,
      onBack,
      shouldPreventClose,
      shouldRenderFooter,
      noScroll,
    } = step;

    const stepProps: StepProps = {
      ...props,
      t,
      transitionTo: this.transitionTo,
    };

    const renderFooter =
      !!StepFooter && (shouldRenderFooter === undefined || shouldRenderFooter(stepProps));

    const preventClose =
      typeof shouldPreventClose === "function"
        ? shouldPreventClose(stepProps)
        : !!shouldPreventClose;

    return (
      <ModalBody
        refocusWhenChange={stepId}
        onClose={preventClose ? undefined : onClose}
        onBack={onBack ? () => onBack(stepProps) : undefined}
        title={title}
        noScroll={noScroll}
        render={() => (
          <>
            {!hideBreadcrumb && (
              <Breadcrumb
                mb={props.error && props.signed ? 4 : 6}
                currentStep={indexVisible}
                items={visibleSteps}
                stepsDisabled={disabledSteps}
                stepsErrors={errorSteps}
              />
            )}
            <StepComponent {...stepProps} />
            {children}
          </>
        )}
        renderFooter={renderFooter ? () => <StepFooter {...stepProps} /> : undefined}
      />
    );
  }
}

export default withTranslation()(Stepper);
