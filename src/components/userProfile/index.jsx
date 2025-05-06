import {User} from "@heroui/react";

export default function UserProfile({ userData }) {
  return (
    <User
      avatarProps={{
        src: "https://avatars.githubusercontent.com/u/30373425?v=4",
      }}
      description={userData?.expertise}
      name={userData?.name}
    />
  );
}
