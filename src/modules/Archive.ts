import { pathinfo } from "utils/path";
import ZipArchive from "utils/ZipArchive";
import { MGL_EXT, MGX2_EXT, MGX_EXT, MGZ_EXT, PATHINFO_EXTENSION } from "constants/path.constants"

/**
 * Class Archive.
 * Archive implements Zip archive containing recorded games.
 *
 * @todo rar extension support
 * @todo test for server zlib/zip extension support
 * @todo be useful (i.e. have analyze methods on this analyze all included recs etc)
 */
class Archive
{

    /**
     * Contains entry details.
     * @var array
     */
    protected stats: any[];

    /**
     * Zip file archive.
     * @var ZipArchive
     */
    protected zip: ZipArchive;

    /**
     * Determines if the archive is open.
     * @var bool
     */
    protected isOpen: boolean;

    /**
     * Class constructor.
     *
     * @return void
     */
    public constructor()
    {
        this.stats = [];
        this.zip = new ZipArchive();
        this.isOpen = false;
    }

    /**
     * Opens a file archive.
     *
     * @param string $filename The file name of the archive to open.
     *
     * @return void
     * @throws Exception
     */
    public open(filename)
    {
        if (this.zip.open(filename) !== true) {
            throw new Error('Unable to open zip archive ' + filename);
        }
        this.isOpen = true;
        this.getDetails();
    }

    /**
     * Close the active archive.
     *
     * @return void
     */
    public close()
    {
        if (this.isOpen) {
            this.zip.close();
        }
    }

    /**
     * Get a file handler to the entry defined by its name.
     *
     * @param string $name The name of the entry to use.
     *
     * @return resource|bool File pointer (resource) on success or false on failure.
     * @throws Exception
     */
    public getFileHandler(name)
    {
        if (!this.open) {
            throw new Error('No archive has been opened');
        }
        return this.zip.getStream(name);
    }

    /**
     * Returns the entry contents using its name.
     *
     * @param string $name The name of the entry.
     *
     * @return mixed The contents of the entry on success or false on failure.
     * @throws Exception
     */
    public getFileContents(name)
    {
        if (!this.open) {
            throw new Error('No archive has been opened');
        }
        return this.zip.getFromName(name);
    }

    /**
     * Get the details of the entries in the archive.
     *
     * @return void
     *
     * @throws Exception
     */
    protected getDetails()
    {
        if (!this.open) {
            throw new Error('No archive has been opened');
        }
        let stat;
        for (let $i = 0; false !== (stat = this.zip.statIndex($i)); $i++) {
            // skip directories and 0-bytes files
            if (!stat['size']) {
                continue;
            }
            // skip useless files
            let $ext = pathinfo(stat['name'], PATHINFO_EXTENSION).toLowerCase();
            if ($ext != MGX_EXT && $ext != MGL_EXT
                && $ext != MGZ_EXT && $ext != MGX2_EXT
            ) {
                continue;
            }
            this.stats = this.stats.concat(stat);
        }
    }

    /**
     * Returns entry details.
     *
     * @return array
     */
    public getStats()
    {
        return this.stats;
    }
}

export default Archive
