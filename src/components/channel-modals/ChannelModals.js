import React, { memo } from 'react';
import { Modal } from 'react-bootstrap';

import Add from './Add';
import Rename from './Rename';
import Remove from './Remove';

const forms = {
  adding: Add,
  renaming: Rename,
  removing: Remove,
};

const getForm = (type) => forms[type];

const ChannelModals = ({ type, hideModal, channel }) => {
  const ModalForm = getForm(type);

  return (
    <Modal autoFocus show={!!type} onHide={hideModal}>
      {type && <ModalForm hideModal={hideModal} channel={channel} />}
    </Modal>
  );
};

export default memo(ChannelModals);
