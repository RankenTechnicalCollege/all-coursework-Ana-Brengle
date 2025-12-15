interface Hero1Props {
  fullName: string
  email: string
  role: string[]
  // badge?: string;
  // heading: string;
  // description: string;
  // buttons?: {
  //   primary?: {
  //     text: string;
  //     url: string;
  //   };
  //   secondary?: {
  //     text: string;
  //     url: string;
  //   };
  // };

}

const Hero1 = ({
  fullName,
  email,
  role

}: Hero1Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {fullName}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              Email:{email}<br/>
              Role: {role.join(", ")}
            </p>
            </div>
          </div>
        </div>
    </section>
  );
};

export { Hero1 };
