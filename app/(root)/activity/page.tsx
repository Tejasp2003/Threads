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
                    <article className="activity-card flex items-start">
                      <Image
                        src={activity.author.image}
                        alt="user_logo"
                        width={25}
                        height={25}
                        className="rounded-full cover"
                        style={{ width: "25px", height: "25px" }}
                      />
                      <p className="!text-small-regular text-light-1 mt-1aq">
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
                <article className="activity-card relative flex items-start">
                  <div className="ml-1 mt-3 flex items-center gap-2">
                    {likeItem.likes.slice(0, 2).map((like: any, index: number) => (
                      <div
                        key={like._id}
                        className={`rounded-full overflow-hidden border-2 -mt-4 border-black ${
                          index !== 0 ? "-ml-4" : ""
                        } z-${100 - index}`}
                        style={{ width: "25px", height: "25px" }} // Set a fixed size
                      >
                        <Image
                          src={like.image}
                          alt={`user_${index}`}
                          width={25}
                          height={25}
                          objectFit="cover" // Maintain aspect ratio and cover the container
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex-grow">
                    <p className="!text-small-regular text-light-1">
                      {likeItem.likes.length > 0 && (
                        <span>
                          {likeItem.likes.slice(0, 2).map((like:any, index: number) => (
                            <span key={like._id}>
                              <span className="mr-1 text-primary-500">
                                {like.name}
                              </span>
                              {index !== likeItem.likes.length - 1 ? ", " : " "}
                            </span>
                          ))}
                          {likeItem.likes.length > 2 && (
                            <span>
                              {" and "}
                              <span className="text-primary-500">
                                {likeItem.likes.length - 2} others
                              </span>
                            </span>
                          )}
                          {" liked your thread: "}
                          <span className="ml-1 text-primary-500">
                            {likeItem.text}
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
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
