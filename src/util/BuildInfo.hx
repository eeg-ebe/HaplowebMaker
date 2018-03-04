class BuildInfo {
    /**
     * The time when this library was build.
     */
    public static var buildTime(default, null):Int = getBuildTime();
    /**
     * The git reversion that was used for the build.
     */
    public static var gitRev(default, null):String = getGITRevision();
    /**
     * Macros initalizing the build information.
     */
    public static macro function getBuildTime() {
        var buildTime = Math.floor(Date.now().getTime() / 1000);
        return macro $v{buildTime};
    }
    public static macro function getGITRevision() {
        var gitrev = new sys.io.Process("git", [ "rev-parse", "--verify", "HEAD" ]).stdout.readAll().toString();
        return macro $v{gitrev};
    }
}
