export default function TextAvatar({ firstName, lastName }) {
  const fullName = firstName + " " + lastName;

  const stringToColor = (str) => {
    let hash = 0;
    let i;

    for (i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "bg-blue-500",
      "bg-pink-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-green-500",
    ];
    const index = Math.abs(hash % colors.length);

    return colors[index];
  };

  const getInitials = () => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="avatar">
      <div>
        <div
          className={`w-10 h-full rounded-full flex items-center justify-center ${stringToColor(
            fullName
          )}`}
        >
          <p className="text-white font-semibold text-lg">{getInitials(fullName)}</p>
        </div>
      </div>
    </div>
  );
}
