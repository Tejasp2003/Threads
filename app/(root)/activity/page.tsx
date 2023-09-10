import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, getActivity } from "@/lib/actions/user.action";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { replies, likes } = await getActivity(userInfo._id);
  const activity = replies;
  // [
  //   {
  //     threadId: new ObjectId("64de4977012da5affee9e532"),
  //     likes: [ [Object], [Object] ]
  //   }
  // ]  likes

  // console.log(likes[0].likes);
  return (
    <>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map(
              (activity) => (
                console.log(activity),
                (
                  <Link
                    key={activity._id}
                    href={`/thread/${activity.parentId}`}
                  >
                    <article className="activity-card">
                      <Image
                        src={activity.author.image}
                        alt="user_logo"
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <p className="!text-small-regular text-light-1">
                        <span className="mr-1 text-primary-500">
                          {activity.author.name}
                        </span>{" "}
                        replied to your thread :
                        <span className="ml-1 text-primary-500">
                          {activity.text}
                        </span>
                      </p>
                    </article>
                  </Link>
                )
              )
            )}
            {likes.map((likeItem: any) => (
              <Link
                key={likeItem.threadId}
                href={`/thread/${likeItem.threadId}`}
              >
                <article className="activity-card relative flex items-center">
                  <div className="ml-1 mt-3 flex items-center gap-2">
                    {likeItem.likes.slice(0, 2).map((like, index) => (
                      <Image
                        key={like._id}
                        src={like.image}
                        alt={`user_${index}`}
                        width={25}
                        height={25}
                        className={`rounded-full -mt-3 object-cover border-2 border-black  ${
                          index !== 0 ? "-ml-4" : ""
                        } z-${100 - index}`}
                      />
                    ))}
                  </div>
                  <p className="!text-small-regular text-light-1">
                    {likeItem.likes.length > 0 && (
                      <span>
                        {likeItem.likes.map((like, index) => (
                          <span key={like._id}>
                            <span className="mr-1 text-primary-500">
                              {like.name}
                            </span>
                            {index !== likeItem.likes.length - 1 ? ", " : " "}
                          </span>
                        ))}
                        liked your thread : 
                        <span className="ml-1 text-primary-500">
                          {likeItem.text}
                        </span>
                      </span>
                    )}
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </>
  );
}

export default Page;
