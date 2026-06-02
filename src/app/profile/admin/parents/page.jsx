import ProfileUsers from "@/features/profile/ui/ProfileUsers/ProfileUsers";

export default function AdminParentsPage() {
  return (
    <ProfileUsers
      roleFilter="parent"
      lockedRole="parent"
      titleKey="profile.parents"
      descriptionKey="profile.parentsDescription"
      managerTitleKey="profile.parents"
      newButtonKey="profile.newParent"
      emptyKey="profile.parentsEmpty"
    />
  );
}
