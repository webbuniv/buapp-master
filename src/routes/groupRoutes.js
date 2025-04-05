import express from 'express';
import {
  createGroup,
  sendGroupMessage,
  getUserGroups,
  getGroupDetails,
  getGroupMessages,
  addGroupMembers,
  removeGroupMember,
  requestToJoinGroup,
  getGroupJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  leaveGroup,
  updateGroup,
  makeGroupAdmin,
  removeGroupAdmin,
  pinGroupMessage,
  unpinGroupMessage,
  getPinnedMessages,
  uploadGroupFile,
} from '../controllers/groupController.js';

const router = express.Router();

router.post('/create', createGroup);
router.post('/send', sendGroupMessage);
router.get('/user/:userId', getUserGroups);
router.get('/:groupId', getGroupDetails);
router.get('/:groupId/messages', getGroupMessages);
router.post('/:groupId/members', addGroupMembers);
router.delete('/:groupId/members/:memberId', removeGroupMember);
router.post('/request-join', requestToJoinGroup);
router.get('/:groupId/join-requests', getGroupJoinRequests);
router.post('/:groupId/approve', approveJoinRequest);
router.post('/:groupId/reject', rejectJoinRequest);
router.post('/:groupId/leave', leaveGroup);
router.put('/:groupId', updateGroup);
router.post('/:groupId/make-admin', makeGroupAdmin);
router.post('/:groupId/remove-admin', removeGroupAdmin);
router.post('/:groupId/pin-message', pinGroupMessage);
router.post('/:groupId/unpin-message', unpinGroupMessage);
router.get('/:groupId/pinned-messages', getPinnedMessages);
router.post('/upload', uploadGroupFile);

export default router;
