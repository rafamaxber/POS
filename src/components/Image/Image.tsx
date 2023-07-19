import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";

import { storage } from "../../gateways/firebase";
import { useStatus } from "../../hooks/useStatus";

export function Image({ photoRef }: { photoRef: string }) {
  const [photoUrl, setPhotoUrl] = useState('')
  const { startLoading, stopLoading, setErrorLoading, loading } = useStatus();

  useEffect(() => {
    if (photoRef) {
      startLoading();

      const gsReference = ref(storage, photoRef);
      getDownloadURL(gsReference).then((url) => {
        setPhotoUrl(url);
      }).catch((error) => {
        setErrorLoading(error)
      }).finally(() => {
        stopLoading()
      })
    }
  }, [photoRef]);


    if (loading || !photoUrl) {
      return (
        <div className='product-image'>
          <img src='data:image/webp;base64,UklGRooEAABXRUJQVlA4WAoAAAAgAAAAlQAAlQAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOCBMAgAAcBEAnQEqlgCWAD4pFIlDIaEhEapsJBgChLS3cLr4shaz5hhZAjgZKPiA0nEzf9dfPYQ0XLIKGyRcsgobJFyyChskXLIJm7ZZ/1p/JFBsdvOwitjFFI/4246/wjTxzeyuErEmT0OseN+s9VeXgPp0yvV72EeLeoh6bpn0E3bgj1PxmyRdrgUNki5ZBQ2SLlkFDZItIAD+/9LsACGdcrGzxlPU6BOCq7wa7A7fz4x9GAZG0jiv0pyVNFHCRm7C0PnT0a/rRI+4M8LMkqhv6G7vXqj/IBZLlnkO/TQOhGuJbxMXnIUlrkRT+2uVYh6emOKuJhzUfg8gmgOGbwzMbKPaJzEQbuIl7pDVe6RH33vofZlbCgbeZxxdS4I2osCDsgIpz55Q/yX5b0y8+W4CisuMF22U9wx9E+6SfooulF69Tt0JFk043oLESFhaKKA/my1O/0LXLe5arfemH/z2qVRkOFBHhAifJsUaSH5qoVJTvywK1kczNm28v4Mnhn21s7TeT7BJgBLOIjcoXsVwPnz+6oOosRUhFTPczYRnMD78rAnlbn3gHP5x+CbJH++wPVoZUO/xQjKJ/Vulyuzga1W7ezoCHpba29/r8FQAT/+juZpFMnl2pTdo3MNl9byzUzH7wawVI+DwK3zCyHxVCBiJBbKpQWhoY9bMgy9ocKhxsJLQjPc8qjCUR2FVAiBFY29sCFSIbeMhAHz6krpCOTvSvVlpZE8V+0lHK3jPS59CsfGs6S+05kQeX9/HOQpl1nGmEgpTOf5IEAAAAAAA' alt="product" loading='lazy' />
        </div>
      )
    }

    return (
      <div className='product-image'>
        <img src={photoUrl} alt="product" loading='lazy' />
      </div>
    )
}
