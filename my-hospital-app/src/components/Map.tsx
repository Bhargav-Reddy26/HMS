"use client";

export default function Map() {
  return (
    <section className="py-16 px-6 bg-gray-100">
      <h3 className="text-3xl font-bold text-center mb-8 text-black">📍 Our Location</h3>
      <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps?q=123+Main+Street,+Your+City,+Your+Country&output=embed"
          className="w-full h-96 border-0"
          allowFullScreen
          loading="lazy"
          title="Hospital Location"
        />
      </div>
    </section>
  );
}
