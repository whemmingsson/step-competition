export const ProfileImage = ({
  url,
  name,
}: {
  url?: string | null;
  name?: string;
}) => {
  return (
    <div className="relative w-8 h-8">
      {url ? (
        <img
          src={url}
          alt={name || "Profile Image"}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-slate-500 text-amber-50 flex items-center justify-center text-center">
          <span className="text-sm font-medium">
            {name?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
      )}
    </div>
  );
};
