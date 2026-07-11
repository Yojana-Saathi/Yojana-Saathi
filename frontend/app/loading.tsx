export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-[#0B1E3D] via-[#0F2645] to-[#142E4D]">
      <div className="w-[300px] max-w-full px-4 sm:w-[400px]">
        <video
          src="/loader-ring.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full"
        />
      </div>
    </div>
  );
}
