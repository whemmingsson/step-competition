import { CompetitionService } from "@/services/CompetitionService";
import { LocalStorageService } from "@/services/LocalStorageService";
import { useCallback, useEffect, type JSX } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const CompetitionHandler = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();

  // Workaround for HashRouter - parse URL parameters manually
  const getUrlParams = () => {
    const url = window.location.href;
    const urlObj = new URL(url);
    return {
      inviteId: urlObj.searchParams.get("inviteId"),
      inviteKey: urlObj.searchParams.get("inviteKey"),
    };
  };

  const { inviteId, inviteKey } = getUrlParams();

  console.log(inviteId, inviteKey);

  const verifyInvite = useCallback(async () => {
    if (inviteId && inviteKey) {
      const inviteSuccess = await CompetitionService.verifyInviteToCompetition(
        inviteId,
        inviteKey
      );
      if (inviteSuccess) {
        LocalStorageService.setSelectedCompetitionId(parseInt(inviteId, 10));
        LocalStorageService.setInviteKey(inviteKey);
        toast("Invite verified successfully! 🎉");

        // Clear URL parameters after successful verification
        const url = new URL(window.location.href);
        url.searchParams.delete("inviteId");
        url.searchParams.delete("inviteKey");
        window.history.replaceState(null, "", url.toString());

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        console.error("Invalid invite ID or key");

        // Clear URL parameters on error as well
        const url = new URL(window.location.href);
        url.searchParams.delete("inviteId");
        url.searchParams.delete("inviteKey");
        window.history.replaceState(null, "", url.toString());

        navigate("/error");
      }
    } else {
      console.warn("Invite ID or Key is missing");
    }
  }, [inviteId, inviteKey, navigate]);

  useEffect(() => {
    const handleInvite = async () => {
      if (import.meta.env.VITE_COMPETITION_MODE === "invite-only") {
        if (LocalStorageService.getInviteKey()) {
          // Key is only set on successful invite verification
          // Therefore, do not proceed if it already exists
          return;
        }
        if (inviteId && inviteKey) {
          await verifyInvite();
        } else {
          console.warn("Invite ID or Key is missing");
        }
      }
      if (import.meta.env.VITE_COMPETITION_MODE === "public") {
        // Do nothing for public mode
      }
    };
    handleInvite();
  }, [inviteId, inviteKey, verifyInvite]);

  // This component can be used to handle competition-related logic
  // For now, it just renders its children
  return children;
};
