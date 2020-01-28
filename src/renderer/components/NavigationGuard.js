// @flow
import React, { useState, useCallback, memo, useEffect } from "react";
import { Prompt, useHistory } from "react-router-dom";
import ConfirmModal from "~/renderer/modals/ConfirmModal";

type Props = {
  when: boolean,
  shouldBlockNavigation?: *,
  analyticsName: string,
  title: string,
};

const NavigationGuard = ({
  when,
  shouldBlockNavigation = () => true,
  analyticsName,
  title,
  ...confirmModalProps
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const history = useHistory();

  const showModal = useCallback(
    location => {
      setModalVisible(true);
      setLastLocation(location);
    },
    [setModalVisible, setLastLocation],
  );

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  const handleBlockedNavigation = useCallback(
    nextLocation => {
      if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
        showModal(nextLocation);
        return false;
      }

      return true;
    },
    [confirmedNavigation, shouldBlockNavigation, showModal],
  );

  const handleConfirmNavigationClick = useCallback(() => {
    setModalVisible(false);
    if (lastLocation) setConfirmedNavigation(true);
  }, [setModalVisible, lastLocation]);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) history.push(lastLocation.pathname);
  }, [confirmedNavigation, lastLocation, history]);

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <ConfirmModal
        {...confirmModalProps}
        title={title}
        analyticsName={analyticsName}
        isOpened={modalVisible}
        onReject={closeModal}
        onConfirm={handleConfirmNavigationClick}
      />
    </>
  );
};

export default memo<Props>(NavigationGuard);
