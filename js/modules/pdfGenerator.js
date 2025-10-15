export class PDFGenerator {
    constructor(songManager) {
        this.songManager = songManager;
    }

    async generatePDF() {
        // Mostrar loading
        this.songManager.showButtonLoading('downloadPdfBtn', 'downloadPdfText', 'downloadPdfSpinner');

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            this.addHeader(doc);
            this.addSongsList(doc);
            
            doc.save('lista-de-temas.pdf');
        } finally {
            // Ocultar loading
            this.songManager.hideButtonLoading('downloadPdfBtn', 'downloadPdfText', 'downloadPdfSpinner');
        }
    }

    addHeader(doc) {
        doc.setFontSize(16);
        doc.text('Lista de temas', 20, 20);
        
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        doc.setFontSize(10);
        doc.text(`Generado el: ${currentDate}`, 20, 30);
        
        const totalSongs = this.songManager.filteredSongs.length;
        doc.text(`Total de canciones: ${totalSongs}`, 20, 37);
    }

    addSongsList(doc) {
        doc.setFontSize(10);
        let yPosition = 50;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        const lineHeight = 7;
        const commentLineHeight = 6;
        
        this.songManager.filteredSongs.forEach((song, index) => {
            if (yPosition > pageHeight - 30) {
                doc.addPage();
                yPosition = 20;
            }
            
            const songText = `${index + 1}. ${song.artistName} - ${song.songName} (${song.type})`;
            doc.text(songText, margin, yPosition);
            yPosition += lineHeight;
            
            if (song.comments && song.comments.trim()) {
                doc.setFontSize(8);
                const comments = this.wrapText(doc, song.comments, 80);
                comments.forEach(line => {
                    if (yPosition > pageHeight - 20) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    doc.text(`   ${line}`, margin + 5, yPosition);
                    yPosition += commentLineHeight;
                });
                doc.setFontSize(10);
            }
            
            yPosition += 2;
        });
    }

    wrapText(doc, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const textWidth = doc.getTextWidth(testLine);
            
            if (textWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    generateFilteredPDF() {
        if (this.songManager.filteredSongs.length === 0) {
            alert('No hay canciones para generar el PDF. Ajusta los filtros o agrega canciones.');
            return;
        }
        
        this.generatePDF();
    }
}
