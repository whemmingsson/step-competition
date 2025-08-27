export const CircleImage = ({
  url,
  name,
    size = 8,
}: {
  url?: string | null;
  name?: string;
  size?: number;
}) => {

  const sizeClass = `w-${size} h-${size} `;
  return (
    <div className={`relative ${sizeClass}`}>
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
