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
        setTimeout(() => {
          // Clear URL parameters when navigating to root
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.hash.split("?")[0]
          );
          navigate("/");
        }, 2000);
      } else {
        console.error("Invalid invite ID or key");
        // Clear URL parameters when navigating to error page
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.hash.split("?")[0]
        );
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
