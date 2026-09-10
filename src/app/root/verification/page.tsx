"use client";
import { Icon } from "@/components/ui/icon";
import { container_variants, item_variants } from "@/constants/framer-motion";
import PageContainer from "@/components/providers/page-container";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  kycRequirementsLevel0,
  verificationFeaturesLevel0,
  verificationFeaturesLevel1,
} from "@/constants/verificationFeatures";
import { useRouter } from "nextjs-toploader/app";
import { useUser } from "@/hooks/useUser";
import { useGetKYCDocuments } from "@/hooks/useKyc";
import { Modal } from "@/components/ui/modal";
import { TKYCDocumentApiResponse } from "@/types/api.response";
import { formatIST } from "@/lib/utils";
import { TagChip } from "@/components/ui/tag-chip";
import { StatusDot } from "@/components/ui/status-dot";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[15px] leading-6 font-medium text-foreground">{children}</h3>
);

const ModalRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 h-12 border-b border-border last:border-0">
    <span className="text-[15px] leading-6 text-muted-foreground">{label}</span>
    <span className="text-[15px] leading-6 text-foreground">{value}</span>
  </div>
);

/** Reference Verification page: level header + progress, level tabs, features table, KYC list, documents table. */
const page = () => {
  const [activeTab, setActiveTab] = useState("level0");
  const [progress, setProgress] = useState(0);
  const { user, isLoading } = useUser();
  const { kycDocuments, isLoading: isKYCDocumentsLoading } = useGetKYCDocuments();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState<TKYCDocumentApiResponse | null>(null);

  const status = user?.kyc_status;
  const level = status === "approved" ? 1 : 0;

  useEffect(() => {
    if (!user) return;
    setProgress(status === "approved" ? 100 : status === "submitted" ? 60 : 5);
  }, [user, status]);

  const features = activeTab === "level0" ? verificationFeaturesLevel0 : verificationFeaturesLevel1;
  const canUpgrade = status !== "approved" && status !== "submitted";

  return (
    <PageContainer scrollable={true}>
      <Modal
        title="Submitted document"
        description="Information about the submitted document"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div className="flex flex-col">
          <ModalRow label="Document" value={content?.document_name} />
          <ModalRow label="Type" value={content?.document_type} />
          <ModalRow label="Status" value={<StatusDot status={content?.status} size="md" />} />
          <ModalRow label="Uploaded" value={content?.uploaded_at ? formatIST(content.uploaded_at) : "Not uploaded"} />
          <ModalRow label="Reviewed" value={content?.reviewed_at ? formatIST(content.reviewed_at) : "Not reviewed"} />
          {content?.admin_notes && (
            <div className="mt-4 rounded-[4px] bg-card p-4">
              <p className="text-[12px] leading-4 text-muted-foreground mb-1">Admin notes</p>
              <p className="text-[15px] leading-6 text-foreground">{content.admin_notes}</p>
            </div>
          )}
        </div>
      </Modal>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container_variants}
        className="flex flex-1 flex-col gap-6 w-full"
      >
        {/* Level header */}
        <motion.div variants={item_variants} className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-field flex items-center justify-center text-muted-foreground shrink-0">
            <Icon name="user-16" size={24} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="text-[12px] leading-4 text-muted-foreground">Your level</span>
              <span className="flex items-center gap-2 text-[18px] leading-6 font-medium text-foreground">
                <Icon name="verification-16" size={16} className="text-muted-foreground" />
                {isLoading ? <Skeleton className="h-5 w-16 bg-field rounded-[4px]" /> : `${level} of 1`}
                {status === "submitted" && <TagChip tone="default">Under review</TagChip>}
                {status === "approved" && <TagChip tone="positive">Verified</TagChip>}
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-field overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading || !canUpgrade}
            onClick={() => router.push("/root/verification/upgrade")}
            className="h-10 shrink-0 rounded-[4px] bg-primary px-6 text-[13.33px] text-black outline outline-1 -outline-offset-1 outline-transparent hover:brightness-110 hover:outline-primary transition-[filter,outline-color] duration-150 ease-in-out disabled:text-black/30 disabled:hover:brightness-100 disabled:hover:outline-transparent"
          >
            {status === "rejected" ? "Reapply" : "Upgrade"}
          </button>
        </motion.div>

        {/* Level tabs */}
        <motion.div variants={item_variants}>
          <Tabs onValueChange={setActiveTab} value={activeTab}>
            <TabsList>
              <TabsTrigger value="level0" className="gap-2">
                Level 0
                {level === 0 && <TagChip tone="positive">Current</TagChip>}
                {level === 1 && <TagChip>Completed</TagChip>}
              </TabsTrigger>
              <TabsTrigger value="level1" className="gap-2">
                LEVEL 1
                {level === 1 && <TagChip tone="positive">Current</TagChip>}
                {status === "submitted" && <TagChip>Under review</TagChip>}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Features */}
        <motion.div variants={item_variants} className="flex flex-col gap-4">
          <SectionTitle>Verification Level {activeTab === "level0" ? "0" : "1"}</SectionTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Features</TableHead>
                <TableHead className="text-right">Allowed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature, i) => (
                <TableRow key={i} className="h-12">
                  <TableCell className="text-[12px] leading-4 text-muted-foreground">{feature.title}</TableCell>
                  <TableCell className="text-right">
                    {feature.allowed ? (
                      <span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-positive text-black">
                        <Icon name="check-16" size={12} />
                      </span>
                    ) : (
                      <span className="inline-flex size-4 items-center justify-center text-destructive">
                        <Icon name="close-16" size={16} />
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        {/* Requirements */}
        <motion.div variants={item_variants} className="flex flex-col gap-2">
          {activeTab === "level0" ? (
            <>
              <SectionTitle>KYC Requirements for Level 1:</SectionTitle>
              <ul className="list-disc pl-5 text-[15px] leading-6 text-muted-foreground">
                {kycRequirementsLevel0.map((r, i) => (
                  <li key={i}>{r.title}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <SectionTitle>Accreditation Tests</SectionTitle>
              <p className="text-[15px] leading-6 text-muted-foreground">
                To access high-risk instruments and operations, testing is required for unqualified investors
              </p>
            </>
          )}
        </motion.div>

        {/* Documents */}
        <motion.div variants={item_variants} className="flex flex-col gap-4">
          <SectionTitle>Document Verification</SectionTitle>
          {isKYCDocumentsLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-field rounded-[4px]" />
              ))}
            </div>
          )}
          {!isKYCDocumentsLoading && kycDocuments.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Group</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Date Processed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {kycDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.document_type?.replace(/_/g, " ") || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.document_name}</TableCell>
                    <TableCell>{doc.uploaded_at ? formatIST(doc.uploaded_at, { day: "2-digit", month: "2-digit", year: "numeric" }) : "-"}</TableCell>
                    <TableCell>{doc.reviewed_at ? formatIST(doc.reviewed_at, { day: "2-digit", month: "2-digit", year: "numeric" }) : "-"}</TableCell>
                    <TableCell>
                      <StatusDot status={doc.status} size="md" />
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setContent(doc);
                          setOpenModal(true);
                        }}
                        className="text-[15px] leading-6 text-primary hover:text-primary-hover"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isKYCDocumentsLoading && kycDocuments.length === 0 && (
            <div className="h-[200px] rounded-[4px] border border-border flex flex-col items-center justify-center gap-3">
              <span className="size-10 rounded-full bg-field inline-flex items-center justify-center text-muted-foreground">
                <Icon name="no-data-16" size={16} />
              </span>
              <span className="text-[15px] leading-6 text-muted-foreground">No documents submitted yet</span>
              <button
                type="button"
                onClick={() => router.push("/root/verification/upgrade")}
                className="h-10 rounded-[4px] bg-primary px-6 text-[13.33px] text-black outline outline-1 -outline-offset-1 outline-transparent hover:brightness-110 hover:outline-primary transition-[filter,outline-color] duration-150 ease-in-out"
              >
                Upload Document
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default page;
