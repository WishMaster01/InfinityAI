import React from "react";
import { assets } from "../assets/assets";

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "John Doe",
      title: "Marketing Director, TechCorp",
      content:
        "InfinityAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.",
      rating: 4,
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Jane Smith",
      title: "Content Creator, TechCorp",
      content:
        "InfinityAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: "David Lee",
      title: "Content Writer, TechCorp",
      content:
        "InfinityAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 4,
    },
  ];

  return (
    <section className="px-4 py-28 sm:px-8 lg:px-20 xl:px-32">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
        <span className="section-kicker">Social proof</span>
        <h2 className="section-title">
          Loved by{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Creators
          </span>
        </h2>
        <p className="section-copy">
          Don't just take our word for it. Here's what our users are saying.
        </p>
      </div>
      <div className="mt-16 grid gap-7 md:grid-cols-3">
        {dummyTestimonialData.map((testimonial, index) => (
          <div
            key={index}
            className="premium-card p-8"
          >
            <div className="flex items-center gap-1">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <img
                    key={index}
                    src={
                      index < testimonial.rating
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    className="h-5 w-5"
                    alt="Star rating"
                  />
                ))}
            </div>
            <p className="my-8 text-lg leading-8 text-slate-600">
              "{testimonial.content}"
            </p>
            <hr className="mb-6 border-slate-200" />
            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                className="h-14 w-14 rounded-2xl object-cover ring-4 ring-blue-50"
                alt={testimonial.name}
              />
              <div>
                <h3 className="text-base font-black text-slate-900">{testimonial.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default Testimonial;
