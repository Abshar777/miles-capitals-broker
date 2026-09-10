"use client";
import PageContainer from "@/components/providers/page-container";
import { motion } from "framer-motion";
import { container_variants } from "@/constants/framer-motion";
import { useUser } from "@/hooks/useUser";
import { ProfileDetailsCard } from "@/components/page-sections/profile/profileDetailedCard";

/** Reference "Profile Info": key/value sections on the left, avatar block on the right. */
const ProfilePage = () => {
  const { user, isLoading } = useUser();

  return (
    <PageContainer scrollable={true}>
      <motion.div
        className="w-full flex flex-1 flex-col"
        initial="hidden"
        animate="visible"
        variants={container_variants}
      >
        <ProfileDetailsCard user={user} isLoading={isLoading} />
      </motion.div>
    </PageContainer>
  );
};

export default ProfilePage;
