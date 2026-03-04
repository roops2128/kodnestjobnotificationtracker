const Digest = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-5">
      <div className="text-center border border-dashed rounded-md p-4 max-w-prose">
        <h1 className="font-serif text-heading text-foreground">Daily Digest</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Your curated digest will be generated here once matching is active.
        </p>
      </div>
    </div>
  );
};

export default Digest;
