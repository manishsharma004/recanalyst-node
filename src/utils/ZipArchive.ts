class ZipArchive {
    open(filename: string) {
        return true
    }
    close() {
    }
    getStream(name: string) {

    }
    getFromName(name: string) {

    }
    statIndex(index: number) {
        return false;
    }
}

export default ZipArchive
