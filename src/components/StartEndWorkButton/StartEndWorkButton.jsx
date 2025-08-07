import PropTypes from "prop-types";

function StartEndWorkButton({
  onOpen,
  handleSlideComplete,
  statusLoading,
  checkedIn,
  checkedOut,
}) {
  return (
    <div className=" flex justify-center align-middle mb-32">
      <button
        onClick={() => {
          if (!localStorage.getItem("platintoken")) {
            onOpen();
          } else {
            handleSlideComplete();
          }
        }}
        className={`group duration-500 before:duration-500 after:duration-500 underline underline-offset-2 relative ${
          checkedIn && !checkedOut
            ? " bg-[rgb(238,73,73)] underline underline-offset-4 decoration-2 text-white after:-right-2 before:top-8 before:right-16 after:scale-150 after:blur-none before:-bottom-8 before:blur-none before:bg-black after:bg-[#262626]"
            : "bg-gradient-to-b from-[#262626] to-[#0a0a0a] text-gray-50 after:right-8 after:top-3 before:right-1 before:top-1 before:blur-lg after:blur before:bg-red-700 after:bg-[rgb(238,73,73)]"
        } h-16 w-[90%] border text-left p-3 text-base font-bold rounded-xl overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:z-10 before:rounded-full after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:rounded-full`}
        disabled={statusLoading || (checkedIn && checkedOut)}
      >
        {statusLoading
          ? "Loading..."
          : checkedIn && !checkedOut
          ? "Check Out"
          : checkedIn && checkedOut
          ? "     شما امروز ورود کرده اید"
          : "Check In"}
      </button>
    </div>
  );
}

StartEndWorkButton.propTypes = {
  onOpen: PropTypes.func.isRequired,
  handleSlideComplete: PropTypes.func.isRequired,
  statusLoading: PropTypes.bool.isRequired,
  checkedIn: PropTypes.bool.isRequired,
  checkedOut: PropTypes.bool.isRequired,
};

export default StartEndWorkButton;
