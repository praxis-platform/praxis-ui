import { gql } from "@apollo/client";
import { UserAvatarFragmentDoc } from "../../../users/fragments/gen/UserAvatar.fragment";
import { FollowButtonFragmentDoc } from "../../../users/fragments/gen/FollowButton.fragment";

// THIS FILE IS GENERATED, DO NOT EDIT
/* eslint-disable */

export type GroupMemberFragment = {
  __typename?: "User";
  id: number;
  name: string;
  isFollowedByMe: boolean;
  profilePicture: { __typename?: "Image"; id: number };
};

export const GroupMemberFragmentDoc = gql`
  fragment GroupMember on User {
    id
    ...UserAvatar
    ...FollowButton
  }
  ${UserAvatarFragmentDoc}
  ${FollowButtonFragmentDoc}
`;
