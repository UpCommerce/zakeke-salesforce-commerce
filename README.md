<b>Zakeke Link Cartridge - Version 21.1.3 <br>
FutureNext</b>

Downloading:<br>
1) Download link_zakeke.zip and extract it in link_zakeke directory<br>
2) Downlaod SFRA cartridge and Sitegenesis cartridge and copy it in the link_zakeke directory<br>
3) At the end the structure should be <br>
	link_zakeke-><br>
		----link_zakeke<br>
		----storefront-reference-architecture<br>
		----storefront_controllers<br>
		----storefront_core<br>
		----storefront_pipelines<br>
<br>
Installing:<br>
1) Go to link_zakeke/link_zakeke directory<br>
2) Install all the libraries: npm install<br>
3) Compile js files: npm run compile:js<br>
4) Compile scss files: npm run compile:scss<br>
5) Modify the dw.json file with your salesforce sandbox credentials<br>
6) Upload source code to sandbox importing the projects into Eclipse (UX Studio)<br>

<br>
Linting:<br>
1) Linting js: npm run lint:js<br>
1) Linting scss: npm run lint:scss<br>

<br>
Testing:<br>
1) Unit testing: npm run test:unit<br>
3) Integration testing: <br>
	-Configure 'it.config.js' file<br>
	-npm run test:integration<br>
	
<br>
Please check ./documentation/Zakeke Integration Guide.docx (for SiteGenesis) and ./documentation/Zakeke SFRA Integration Guide.docx (for SFRA) as integration guide.

The Github repo / issues are generally unmonitored. Please email the Zakeke team with any questions or concerns using: info@zakeke.com
